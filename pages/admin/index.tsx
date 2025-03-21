import { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash, FiUsers, FiDollarSign } from 'react-icons/fi';

// Register chart components
Chart.register(...registerables);

// Mock data
const mockCampaigns = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: `Campaign ${i + 1}`,
  category: ['Education', 'Sports', 'Infrastructure'][i % 3],
  status: ['active', 'completed', 'paused'][i % 3],
  goal: Math.floor(Math.random() * 50000 + 50000),
  raised: Math.floor(Math.random() * 50000),
  startDate: new Date(),
  endDate: new Date(Date.now() + 2592000000) // +30 days
}));

const mockDonors = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Donor ${i + 1}`,
  email: `donor${i + 1}@campus.edu`,
  totalDonations: Math.floor(Math.random() * 5000),
  lastDonation: new Date()
}));

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [donors, setDonors] = useState(mockDonors);

  // Chart data
  const campaignData = {
    labels: ['Education', 'Sports', 'Infrastructure', 'Other'],
    datasets: [{
      label: 'Campaigns by Category',
      data: [12, 19, 3, 5],
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#6B7280']
    }]
  };

  const donationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Donations',
      data: [6500, 5900, 8000, 8100, 5600, 5500],
      borderColor: '#3B82F6',
      tension: 0.4
    }]
  };

  const deleteCampaign = (id: number) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
        </div>
        <nav className="p-4 space-y-2">
          {['campaigns', 'donors', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                activeTab === tab ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Campaign Management */}
        {activeTab === 'campaigns' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h1 className="text-2xl font-bold text-gray-800">Campaign Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">{campaign.title}</h3>
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-600' :
                      campaign.status === 'completed' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>${campaign.raised.toLocaleString()}</span>
                      <span>Goal: ${campaign.goal.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                        <FiEdit /> Edit
                      </button>
                      <button
                        onClick={() => deleteCampaign(campaign.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                      >
                        <FiTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Donor Management */}
        {activeTab === 'donors' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Donor Management</h1>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-3">Donor</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Total Donations</th>
                      <th className="pb-3">Last Donation</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map((donor) => (
                      <tr key={donor.id} className="border-b hover:bg-gray-50">
                        <td className="py-4">{donor.name}</td>
                        <td>{donor.email}</td>
                        <td>${donor.totalDonations.toLocaleString()}</td>
                        <td>{donor.lastDonation.toLocaleDateString()}</td>
                        <td>
                          <button className="text-blue-600 hover:text-blue-800">
                            <FiEdit />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reports */}
        {activeTab === 'reports' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <h1 className="text-2xl font-bold text-gray-800">Analytics Reports</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Campaign Distribution</h3>
                <Pie data={campaignData} />
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Donation Trends</h3>
                <Line data={donationData} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Top Campaigns</h3>
              <Bar
                data={{
                  labels: mockCampaigns.slice(0, 5).map(c => c.title),
                  datasets: [{
                    label: 'Funds Raised',
                    data: mockCampaigns.slice(0, 5).map(c => c.raised),
                    backgroundColor: '#3B82F6'
                  }]
                }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;