import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit } from 'react-icons/fi';
import { Donation, SavedCampaign } from '@/types/dataTypes';


const UserDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@campus.edu',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  });

  // Mock data
  const donations: Donation[] = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    campaign: `Campaign ${i + 1}`,
    amount: Math.floor(Math.random() * 500 + 50),
    date: new Date().toISOString(),
    status: ['Completed', 'Processing', 'Failed'][i % 3]
  }));

  const savedCampaigns: SavedCampaign[] = Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    title: `Saved Campaign ${i + 1}`,
    progress: Math.floor(Math.random() * 100),
    image: `https://picsum.photos/200/150?random=${i}`
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <img
                src={userData.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
              />
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              >
                <FiEdit className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 flex-1">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    className="text-2xl font-bold border rounded-lg px-4 py-2 w-full"
                  />
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    className="text-gray-600 border rounded-lg px-4 py-2 w-full"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
                  <p className="text-gray-600">{userData.email}</p>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Donation History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">Donation History</h3>
          <div className="space-y-4">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{donation.campaign}</h4>
                  <p className="text-sm text-gray-500">{new Date(donation.date).toLocaleDateString()}</p>
                </div>
                <div className="mt-2 md:mt-0 text-right">
                  <p className="text-lg font-bold text-blue-600">
                    ${donation.amount.toFixed(2)}
                  </p>
                  <span className={`text-sm ${
                    donation.status === 'Completed' ? 'text-green-500' :
                    donation.status === 'Processing' ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {donation.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Saved Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">Saved Campaigns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">{campaign.title}</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{campaign.progress}% Funded</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;