'use client';

interface Props {
  campaignsFunc: () => Promise<Campaign[]>;
}

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import CampaignCard from '@/components/CampaignCard';
import { Campaign } from '@/types/dataTypes';
import CreateCampaignModal from '@/components/CreateCampaignModal';
import{ LoadingSpinner }  from '@/components/LoadingComponent';

export default function CampaignBrowsingComponent({ campaignsFunc }: Props) {
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await campaignsFunc();
        if (Array.isArray(response)) {
          setAllCampaigns(response);
        } else {
          console.error('Invalid response format:', response);
          setAllCampaigns([]);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setAllCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [campaignsFunc]);

  // Filtered campaigns using useMemo for better performance
  const filteredCampaigns = useMemo(() => {
    return allCampaigns.filter(campaign => {
      // Search term filtering
      const searchTermLower = searchTerm.toLowerCase().trim();
      const matchesSearch = searchTermLower === '' || 
        campaign.title.toLowerCase().includes(searchTermLower) ||
        campaign.description.toLowerCase().includes(searchTermLower);

      // Category filtering
      const matchesCategory = selectedCategory === 'All' || 
        campaign.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [allCampaigns, searchTerm, selectedCategory]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await campaignsFunc();
      if (Array.isArray(response)) {
        setAllCampaigns(response);
      } else {
        console.error('Invalid response format:', response);
        setAllCampaigns([]);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setAllCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Campaign
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search campaigns by title or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-48">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="All">All Categories</option>
            <option value="Education">Education</option>
            <option value="Sports">Sports</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Search Results Count */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600">
          Found {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''} matching "{searchTerm}"
        </div>
      )}

      {/* Campaign Grid */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign, index) => (
            <CampaignCard key={campaign._id} campaign={campaign} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-700 text-lg">No campaigns found matching your criteria.</p>
        </div>
      )}

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        onCampaignCreated={fetchCampaigns}
      />
    </div>
  );
}