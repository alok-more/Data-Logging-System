'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import DashboardLayout from '../organization-dashboard/page';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface DeviceDetail {
  id?: number; // Make id optional since it will be auto-generated
  Name: string;
  Baud_Rate: number;
  Parity: string;
  Stop_Bits: number;
  Data_Bits: number;
  Port: string;
}

export default function DeviceConfigurations() {
  const [deviceDetails, setDeviceDetails] = useState<DeviceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDevice, setNewDevice] = useState<DeviceDetail>({
    Name: '',
    Baud_Rate: 0,
    Parity: '',
    Stop_Bits: 0,
    Data_Bits: 0,
    Port: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDeviceDetails = async () => {
      const { data, error } = await supabase.from('Device_Details').select('*');
      if (error) {
        console.error('Error fetching device details:', error);
      } else {
        setDeviceDetails(data);
      }
      setLoading(false);
    };
    fetchDeviceDetails();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDevice({ ...newDevice, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { Name, Baud_Rate, Parity, Stop_Bits, Data_Bits, Port } = newDevice;
    const deviceToInsert = { Name, Baud_Rate, Parity, Stop_Bits, Data_Bits, Port };

    const { error } = await supabase.from('Device_Details').insert([deviceToInsert]);
    if (error) {
      console.error('Error adding new device:', error);
    } else {
      setDeviceDetails((prev) => [...prev, { ...deviceToInsert, id: 0 }]); // ID will be generated
      setNewDevice({ Name: '', Baud_Rate: 0, Parity: '', Stop_Bits: 0, Data_Bits: 0, Port: '' });
      setIsModalOpen(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 rounded-lg shadow-md flex flex-col items-center bg-gradient-to-r from-gray-50 to-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Device Configurations</h1>
        <p className="text-gray-600 mb-4 text-center">Configure and manage your data loggers here.</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 transition transform hover:scale-105"
        >
          Add Device
        </button>
      </div>

      {/* Modal for Adding New Device */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-9/12 lg:w-1/2 transform transition-transform duration-300 scale-100 opacity-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Device</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                {['Name', 'Baud_Rate', 'Parity', 'Stop_Bits', 'Data_Bits', 'Port'].map((field, index) => (
                  <div key={index}>
                    <label htmlFor={field.toLowerCase()} className="block mb-1 text-sm font-medium text-gray-700">
                      {field.replace('_', ' ')}
                    </label>
                    <input
                      id={field.toLowerCase()}
                      type={field === 'Baud_Rate' || field === 'Stop_Bits' || field === 'Data_Bits' ? 'number' : 'text'}
                      name={field}
                      value={newDevice[field as keyof DeviceDetail]}
                      onChange={handleInputChange}
                      placeholder={field.replace('_', ' ')}
                      required
                      className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 transition duration-200 text-gray-700"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 bg-gray-300 text-gray-800 p-2 rounded-lg hover:bg-gray-400 transition transform hover:scale-105"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 transition transform hover:scale-105">
                  Add Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {deviceDetails.map((device) => (
            <div
              key={device.id}
              className="bg-gradient-to-r from-indigo-100 to-blue-50 border border-gray-300 rounded-lg p-4 sm:p-6 shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">{device.Name}</h2>
              <div className="text-gray-700 mb-1 flex items-center">
                <span>Baud Rate: <span className="font-semibold">{device.Baud_Rate}</span></span>
              </div>
              <div className="text-gray-700 mb-1 flex items-center">
                <span>Parity: <span className="font-semibold">{device.Parity}</span></span>
              </div>
              <div className="text-gray-700 mb-1 flex items-center">
                <span>Stop Bits: <span className="font-semibold">{device.Stop_Bits}</span></span>
              </div>
              <div className="text-gray-700 mb-1 flex items-center">
                <span>Data Bits: <span className="font-semibold">{device.Data_Bits}</span></span>
              </div>
              <div className="text-gray-700 mb-1 flex items-center">
                <span>Port: <span className="font-semibold">{device.Port}</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
