'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { DashboardLayout } from '../organization-dashboard/page';

const Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    First_Name: '',
    Last_Name: '',
    Email: '',
    Password: '', // New field
    isAdmin: false,
  });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('Users').select('id, First_Name, Last_Name, Email, isAdmin');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // Add User
  const handleAddUser = async () => {
    if (!formData.First_Name || !formData.Last_Name || !formData.Email || !formData.Password) {
      alert('Please fill all required fields.');
      return;
    }

    const { data, error } = await supabase.from('Users').insert([formData]);
    if (error) {
      console.error('Error adding user:', error);
    } else if (data) {
      setUsers([...users, ...data]);
      setShowModal(false);
      setFormData({ First_Name: '', Last_Name: '', Email: '', Password: '', isAdmin: false });
    }
  };

  // Update User
  const handleUpdateUser = async () => {
    if (!formData.First_Name || !formData.Last_Name || !formData.Email) {
      alert('Please fill all required fields.');
      return;
    }

    const { data, error } = await supabase.from('Users').update(formData).eq('id', currentUserId);
    if (error) {
      console.error('Error updating user:', error);
    } else {
      setUsers(users.map((user) => (user.id === currentUserId ? { ...user, ...formData } : user)));
      setShowModal(false);
      setFormData({ First_Name: '', Last_Name: '', Email: '', Password: '', isAdmin: false });
      setCurrentUserId(null);
    }
  };

  // Edit User
  const handleEditUser = (user: any) => {
    setFormData({
      First_Name: user.First_Name,
      Last_Name: user.Last_Name,
      Email: user.Email,
      Password: '', // Password not pre-filled for security reasons
      isAdmin: user.isAdmin,
    });
    setCurrentUserId(user.id);
    setShowModal(true);
  };

  // UI Loading State
  if (loading) return <div className="text-center text-lg font-semibold mt-10">Loading...</div>;

  // Card Color Logic
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
            {users.map((user) => (
              <div
                key={user.id}
                className={`${getColorForUser(user.isAdmin)} text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden w-full max-w-[500px] mx-auto transform hover:-translate-y-2`}
              >
                <p className="text-2xl font-extrabold mb-4">
                  {user.First_Name} {user.Last_Name}
                </p>
                <p className="text-gray-200 text-lg mb-3">{user.Email}</p>
                <p className="text-gray-300 text-sm mb-2">Admin: {user.isAdmin ? 'Yes' : 'No'}</p>
                <button
                  className="bg-white text-black font-semibold py-3 px-6 rounded-lg mt-4 hover:bg-gray-200 transition duration-300"
                  onClick={() => handleEditUser(user)}
                >
                  Edit User
                </button>
              </div>
            ))}
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
                  value={formData.First_Name}
                  onChange={(e) => setFormData({ ...formData, First_Name: e.target.value })}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-gray-800"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.Last_Name}
                  onChange={(e) => setFormData({ ...formData, Last_Name: e.target.value })}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-gray-800"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.Email}
                  onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-gray-800"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.Password}
                  onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-gray-800"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isAdmin}
                    onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                  />
                  <span className="ml-2 text-gray-800 ">Admin</span>
                </label>
                <div className="flex justify-between mt-4">
                  <button type="button" onClick={currentUserId ? handleUpdateUser : handleAddUser} className="bg-gray-800 text-white px-4 py-2 rounded">
                    {currentUserId ? 'Update User' : 'Add User'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="bg-red-700 px-4 py-2 rounded">
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

export default Users;