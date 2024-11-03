'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import DashboardLayout from '../organization-dashboard/page';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', First_Name: '', Last_Name: '', Email: '', isAdmin: false });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('Users').select('*');

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    const { data, error } = await supabase.from('Users').insert([formData]);
    if (error) {
      console.error('Error adding user:', error);
    } else if (data) {
      setUsers([...users, ...data]);
      setShowModal(false);
      setFormData({ id: '', First_Name: '', Last_Name: '', Email: '', isAdmin: false });
    }
  };

  const handleUpdateUser = async () => {
    const { data, error } = await supabase.from('Users').update(formData).match({ id: currentUserId });
    if (error) {
      console.error('Error updating user:', error);
    } else {
      setUsers(users.map(user => user.id === currentUserId ? { ...user, ...formData } : user));
      setShowModal(false);
      setFormData({ id: '', First_Name: '', Last_Name: '', Email: '', isAdmin: false });
      setCurrentUserId(null);
    }
  };

  const handleEditUser = (user: any) => {
    setFormData({ id: user.id, First_Name: user.First_Name, Last_Name: user.Last_Name, Email: user.Email, isAdmin: user.isAdmin });
    setCurrentUserId(user.id);
    setShowModal(true);
  };

  if (loading) return <div className="text-center text-lg font-semibold mt-10">Loading...</div>;

  const adminColorClass = 'bg-gradient-to-r from-gray-700 to-gray-900';
  const nonAdminColorClass = 'bg-gradient-to-r from-teal-800 to-cyan-900';
  const getColorForUser = (isAdmin: boolean) => (isAdmin ? adminColorClass : nonAdminColorClass);

  return (
    <DashboardLayout>
      <main className="mx-auto px-6 sm:px-12 max-w-full my-0 text-center">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">Manage Your Users Here</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
            >
              Add User
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {users.map((user, index) => {
              const colorClass = getColorForUser(user.isAdmin);

              return (
                <div
                  key={index}
                  className={`${colorClass} text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden w-full max-w-[500px] mx-auto transform hover:-translate-y-2`}
                >
                  <div className="absolute top-2 left-0 w-full h-16 bg-black bg-opacity-30 rounded-t-2xl"></div>
                  <p className="text-white text-2xl font-extrabold mb-4">
                    {user.First_Name} {user.Last_Name}
                  </p>
                  <p className="text-gray-200 text-lg mb-3">{user.Email}</p>
                  <p className="text-gray-300 text-sm mb-2">Admin: {user.isAdmin ? 'Yes' : 'No'}</p>

                  <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full my-4"></div>

                  <button
                    className="bg-white text-black font-semibold py-3 px-6 rounded-lg mt-4 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                    onClick={() => handleEditUser(user)}
                  >
                    Change Details
                  </button>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mb-16"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal for Adding or Updating a User */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">{currentUserId ? 'Edit User' : 'Add New User'}</h2>
              <form>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  value={formData.First_Name}
                  onChange={(e) => setFormData({ ...formData, First_Name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  value={formData.Last_Name}
                  onChange={(e) => setFormData({ ...formData, Last_Name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  value={formData.Email}
                  onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                />
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formData.isAdmin}
                    onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                  />
                  <span className="text-gray-700">Admin</span>
                </label>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={currentUserId ? handleUpdateUser : handleAddUser}
                    className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
                  >
                    {currentUserId ? 'Update User' : 'Add User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
