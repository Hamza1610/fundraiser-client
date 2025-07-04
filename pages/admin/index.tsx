import { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash, FiMenu, FiX, FiUser, FiDollarSign, FiSave } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FiPlus } from 'react-icons/fi';
import { CampaignAPI, DonationAPI } from '@/helpers/apiClient/apiClient';
import { CampaignCardProps, CreateCampaignDTO, UpdateCampaignDTO } from '@/types/dataTypes';
import CreateCampaignModal from '@/components/CreateCampaignModal';
import { useRouter } from 'next/router';


Chart.register(...registerables);

interface Campaign {
  _id: string | number;
  title: string;
  category: string;
  status: 'active' | 'completed' | 'paused';
  goal: number;
  raised: number;

}

interface Donor {
  _id: number;
  donorName: string;
  donorEmail: string;
  donation: number;
  title: string;
  amount: number;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'campaign' | 'donor'; _id: string | number } | null>(null);
  const router = useRouter();

  // Add this state for the create modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Omit<CreateCampaignDTO, 'id'>>({
    title: '',
    description: '',
    category: 'Education',
    goal: 10000,
    image: '',
    creatorId: ''
  });

  // Add this function for creating a new campaign
  const handleCreateCampaign = async () => {
    try {
      // Add a loading state if needed
      
      const response = await CampaignAPI.createCampaign(newCampaign);
     // Assuming the API returns the created campaign with an ID
     console.log("Restult: ", response);
     let createdCampaign: Campaign;

     if (response.success) {
      createdCampaign = response.data?.data;
      console.log("Created: Campaign:", createdCampaign);
      
      // Add to the campaigns list
      setCampaigns(prev => [...prev, createdCampaign]);
     }
      
      
    // Close modal and show success message
    setShowCreateModal(false);
    toast.success('Campaign created successfully');
    
    } catch (error) {
      toast.error('Failed to create campaign');
      console.error('Error creating campaign:', error);
    }
  };

  // Function to handle when a campaign is created successfully
  const handleCampaignCreated = () => {
    // Refetch campaigns to update the list
    handleCreateCampaign();
    router.reload();

        // Reset form
    setNewCampaign({
      title: '',
      description: '',
      category: 'Education',
      goal: 10000,
      image: '',
      creatorId: ''
    });
  };
  // Mock data initialization
  useEffect(() => {
    // Update the mock campaigns initialization
    // const mockCampaigns: Campaign[] = Array.from({ length: 15 }, (_, i) => ({
    //   id: i + 1,
    //   title: `Campaign ${i + 1}`,
    //   category: ['Education', 'Sports', 'Infrastructure'][i % 3],
    //   status: ['active', 'completed', 'paused'][i % 3] as Campaign['status'], // Add type assertion
    //   goal: Math.floor(Math.random() * 50000 + 50000),
    //   raised: Math.floor(Math.random() * 50000),
    // }));

    const getCampaigns = async () => {
      const res = await CampaignAPI.getCreatorCampaigns();
      const userCampaigns = res.success ? res.data.data : [];
      setCampaigns(userCampaigns);      
    }

    const getDonors = async () => {
      const res = await DonationAPI.getDonationsByCreator();
      const userCampaignDonations = res.success ? res.data.data : [];
      setDonors(userCampaignDonations);
    }

    // const mockDonors = Array.from({ length: 50 }, (_, i) => ({
    //   id: i + 1,
    //   name: `Donor ${i + 1}`,
    //   email: `donor${i + 1}@campus.edu`,
    //   totalDonations: Math.floor(Math.random() * 5000),
    //   lastDonation: new Date()
    // }));

    getCampaigns();
    getDonors();
  }, []);

  // Chart data configurations
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

  console.log("Gotten user campaigns: ", campaigns)

  // CRUD Operations
  const handleDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'campaign') {
      const deleteCampaign = async () => {
        const res = await CampaignAPI.deleteCampaign(deleteTarget._id);
        setCampaigns(prev => prev.filter(c => c._id !== deleteTarget._id));
      }

      deleteCampaign();
      toast.success('Campaign deleted successfully');
    } else {
      setDonors(prev => prev.filter(d => d._id !== deleteTarget._id));
      toast.success('Donor deleted successfully');
    }

    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleCampaignUpdate = () => {
    if (!editingCampaign) return;

    const updateCampaign = async () => {
      const res = await CampaignAPI.updateCampaign(editingCampaign._id, editingCampaign);
      setCampaigns(prev =>
        prev.map(c => c._id === editingCampaign._id ? editingCampaign : c)
      );
    }
    
    updateCampaign();
    toast.success('Campaign updated successfully');
    setEditingCampaign(null);
  };

  const handleDonorUpdate = () => {
    if (!editingDonor) return;

    setDonors(prev =>
      prev.map(d => d._id === editingDonor._id ? editingDonor : d)
    );
    toast.success('Donor updated successfully');
    setEditingDonor(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 p-2 bg-white rounded-lg shadow-lg z-50"
      >
        {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:absolute left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
        </div>
        <nav className="p-4 space-y-2">
          {['campaigns', 'donors', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-gray-900 ${
                activeTab === tab ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 sm:p-6">
        {/* Campaign Management */}
        {activeTab === 'campaigns' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Campaign Management</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {campaigns.map((campaign) => (
                <div
                  key={campaign._id}
                  className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{campaign.title}</h3>
                    <span className={`text-xs sm:text-sm px-2 py-1 rounded-full ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                      campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-700 gap-1">
                      <span>Raised: ${campaign.raised.toLocaleString()}</span>
                      <span>Goal: ${campaign.goal.toLocaleString()}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
                      <button
                        onClick={() => setEditingCampaign(campaign)}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 text-sm bg-blue-600 text-white p-2 sm:py-2 rounded-lg hover:bg-blue-700"
                      >
                        <FiEdit className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget({ type: 'campaign', _id: campaign._id });
                          setShowDeleteModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 text-sm bg-red-600 text-white p-2 sm:py-2 rounded-lg hover:bg-red-700"
                      >
                        <FiTrash className="w-4 h-4" /> Delete
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
            <div className="p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Donor Management</h1>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="text-left border-b text-sm text-gray-900">
                      <th className="pb-2 sm:pb-3">Donor</th>
                      <th className="pb-2 sm:pb-3">Email</th>
                      <th className="pb-2 sm:pb-3">Donated</th>
                      <th className="pb-2 sm:pb-3">title</th>
                      <th className="pb-2 sm:pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map((donor) => (
                      <tr key={donor._id} className="border-b hover:bg-gray-50 text-sm text-gray-700">
                        <td className="py-3 sm:py-4">{donor.donorName}</td>
                        <td className="break-all">{donor.donorEmail}</td>
                        <td>${donor.amount.toLocaleString()}</td>
                        <td className="whitespace-nowrap">
                          {donor.title}
                        </td>
                        <td className="flex gap-2 py-3 sm:py-4">
                          <button
                            onClick={() => setEditingDonor(donor)}
                            className="text-blue-600 hover:text-blue-800 p-1 sm:p-2 hover:bg-blue-100 rounded-lg"
                          >
                            <FiEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget({ type: 'donor', _id: donor._id });
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-800 p-1 sm:p-2 hover:bg-red-100 rounded-lg"
                          >
                            <FiTrash className="w-4 h-4 sm:w-5 sm:h-5" />
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
            className="space-y-6 sm:space-y-8"
          >
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics Reports</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Campaign Distribution</h3>
                <div className="h-64 sm:h-80">
                  <Pie
                    data={campaignData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </div>
              </div>
              
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Donation Trends</h3>
                <div className="h-64 sm:h-80">
                  <Line
                    data={donationData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Top Campaigns</h3>
              <div className="h-64 sm:h-80">
                <Bar
                  data={{
                    labels: campaigns.slice(0, 5).map(c => c.title),
                    datasets: [{
                      label: 'Funds Raised',
                      data: campaigns.slice(0, 5).map(c => c.raised),
                      backgroundColor: '#3B82F6'
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Edit Campaign Modal */}
        {editingCampaign && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">
              <h3 className="text-xl font-bold mb-4">Edit Campaign</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    value={editingCampaign.title}
                    onChange={(e) => setEditingCampaign({...editingCampaign, title: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={editingCampaign.category}
                    onChange={(e) => setEditingCampaign({...editingCampaign, category: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Education">Education</option>
                    <option value="Sports">Sports</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleCampaignUpdate}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingCampaign(null)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Donor Modal */}
        {editingDonor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Edit Donor</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    value={editingDonor.donorName}
                    onChange={(e) => setEditingDonor({...editingDonor, donorName: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    value={editingDonor.donorEmail}
                    onChange={(e) => setEditingDonor({...editingDonor, donorEmail: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    type="email"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleDonorUpdate}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingDonor(null)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
              <p className="mb-6">Are you sure you want to delete this {deleteTarget?.type}?</p>
              <div className="flex gap-4">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Floating Action Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-30"
      >
        <FiPlus className="w-6 h-6" />
      </button>

      {/* Create Campaign Modal */}
      {/* Render Create Campaign Modal */}
      <CreateCampaignModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        onCampaignCreated={handleCampaignCreated}
      />

    </div>
  );
};

export default AdminDashboard;