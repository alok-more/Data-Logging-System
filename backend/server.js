    const ModbusRTU = require("modbus-serial");
    const express = require("express");
    const cors = require("cors");
    const { createClient } = require('@supabase/supabase-js');
    
    // Supabase setup
    const supabaseUrl = 'https://pezwxfznbsabcgalhilg.supabase.co'; // Replace with your Supabase URL
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlend4ZnpuYnNhYmNnYWxoaWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAwNDA0NzYsImV4cCI6MjA0NTYxNjQ3Nn0.Ri79G0y1uk9BTfj5-5fsB6p8vHD3Ilt79R2exvSuaSA'; // Replace with your Supabase anonymous key
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const app = express();
    const port = 5000;
    app.use(cors());
    
    // Initialize Modbus client
    const client = new ModbusRTU();
    
    // Connect to Modbus device
    client.connectRTUBuffered("/dev/ttyUSB0", { baudRate: 9600, parity: 'none', stopBits: 1, dataBits: 8 })
        .then(() => client.setID(1))
        .catch(err => console.error("Connection Error:", err));
    
    // Function to read holding registers and store data in Supabase
    async function readAndStoreRegisters() {
        try {
            const data = await client.readHoldingRegisters(0, 2); // Read 2 registers from address 0
            const registerValues = data.data;
    
            // Convert register values
            const value1 = (registerValues[0] / 10).toFixed(1); // Adjust division as per your scaling needs
            const value2 = (registerValues[1] / 10).toFixed(1); // Adjust division as per your scaling needs
            
            // Get current date and time in IST
            const date = new Date();
            const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
            const istDate = new Date(date.getTime() + istOffset);
    
            // Insert data into Supabase
            const { error } = await supabase
                .from('Data_Log')
                .insert([{ timestamp: istDate.toISOString(), value1: parseFloat(value1), value2: parseFloat(value2) }]);
    
            if (error) {
                console.error("Error inserting data into Supabase:", error);
            } else {
                console.log("Data inserted into Supabase:", value1, value2);
            }
        } catch (error) {
            console.error("Error reading registers:", error);
        }
    }
    
    // Set an interval to read and store data every 15 seconds
    setInterval(readAndStoreRegisters, 60000);
    
    // Endpoint to read holding registers
    app.get("/read-holding-registers", async (req, res) => {
        try {
            const data = await client.readHoldingRegisters(0, 2); // Read 2 registers from address 0
            res.json(data.data);
        } catch (error) {
            res.status(500).send("Error reading registers: " + error);
        }
    });
    
    // Endpoint to fetch data logs based on start and end timestamps
    app.get("/api/data-logs", async (req, res) => {
        const { start, end } = req.query;
    
        // Ensure start and end are provided and valid
        if (!start || !end) {
            return res.status(400).json({ error: 'Start and End dates are required.' });
        }
    
        try {
            // Convert start and end to IST
            const startDate = new Date(start);
            const endDate = new Date(end);
            const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
            const istStart = new Date(startDate.getTime() - istOffset).toISOString();
            const istEnd = new Date(endDate.getTime() - istOffset).toISOString();
    
            // Query the Supabase Data_Log table
            const { data, error } = await supabase
                .from('Data_Log')
                .select('*')
                .gte('timestamp', istStart) // Greater than or equal to start date
                .lte('timestamp', istEnd); // Less than or equal to end date
    
            console.log("🚀 ~ app.get ~ data:", data);
    
            if (error) {
                throw error;
            }
    
            res.status(200).json(data); // Send the data back to the client
        } catch (error) {
            console.error("Error fetching data logs:", error);
            res.status(500).json({ error: 'Failed to fetch data logs' });
        }
    });
    
    // Start the server
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
    