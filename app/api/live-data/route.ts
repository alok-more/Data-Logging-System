import { NextApiRequest, NextApiResponse } from 'next';
import ModbusRTU from 'modbus-serial';

const client = new ModbusRTU();

async function readHoldingRegisters() {
  try {
    await client.connectRTUBuffered("/dev/ttyUSB0", {
      baudRate: 9600,
      parity: "none",
      dataBits: 8,
      stopBits: 1,
    });

    client.setID(1);

    const address = 0;
    const quantity = 2;
    const data = await client.readHoldingRegisters(address, quantity);

    return data.data;
  } catch (error) {
    console.error("Error reading holding registers:", error);
    throw error;
  } finally {
    client.close(() => {}); // Add empty callback function
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = await readHoldingRegisters();
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error: 'Failed to read data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
