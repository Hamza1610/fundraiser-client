'use client';

interface Props {
  campaignsFunc: () => Promise<Campaign[]>;
}

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import CampaignCard from '@/components/CampaignCard';
import { Campaign } from '@/types/dataTypes';

export default function CampaignBrowsingComponent({ campaignsFunc }: Props) {
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch campaigns
  useEffect(() => {
    campaignsFunc()
      .then(data => {
        setAllCampaigns(data ?? []);
      })
      .finally(() => setLoading(false));
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

  if (loading) return <div>Loading campaigns…</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Search & Filter Section */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search campaigns..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <FiSearch className="absolute left-4 top-4 text-gray-400 text-xl" />
        </div>
        
        <select
          className="w-full md:w-48 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="All" className="text-gray-900">All Categories</option>
          <option value="Education" className="text-gray-900">Education</option>
          <option value="Sports" className="text-gray-900">Sports</option>
          <option value="Infrastructure" className="text-gray-900">Infrastructure</option>
          <option value="Other" className="text-gray-900">Other</option>
        </select>
      </div>

      {/* Campaign Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.length > 0 ? (
          filteredCampaigns.map((campaign, index) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              index={index}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No campaigns found matching your search criteria
          </div>
        )}
      </div>
    </div>
  );
}