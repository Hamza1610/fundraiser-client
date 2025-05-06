import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FiSearch } from 'react-icons/fi';
import CampaignCard from '@/components/CampaignCard';
import { Campaign } from '@/types/dataTypes';
import { CampaignAPI } from '@/helpers/apiClient/apiClient';

const CampaignBrowsingPage = () => {
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [displayedCampaigns, setDisplayedCampaigns] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 8;
  const loadMoreCount = 4;
  const [visibleCount, setVisibleCount] = useState(pageSize);

  // Fetch all campaigns on mount
  useEffect(() => {
    const fetchCampaigns = async () => {
        setIsLoading(true);
        try {
          const result: any = await CampaignAPI.getCampaigns();
          if (result.success) {
            setAllCampaigns(result.data);
            setError(null);
          } else {
            console.error("Error: ", result.error);
            setError(result.error?.message || 'Failed to fetch campaigns');
          }
        } catch (err: any) {
          console.error("Error: ", err);
          setError(err.message || 'Failed to fetch campaigns');
        } finally {
          setIsLoading(false);
        }
      };

    fetchCampaigns();
  }, []);

  // Update displayed campaigns when filters or data change
  useEffect(() => {
    const filterCampaigns = () => {
      const filtered = allCampaigns.filter((campaign: Campaign) => {
        const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || campaign.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });

      setDisplayedCampaigns(filtered.slice(0, visibleCount));
      setHasMore(visibleCount < filtered.length);
    };

    const debounceTimer = setTimeout(filterCampaigns, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory, allCampaigns, visibleCount]);

  const loadMore = () => {
    setTimeout(() => {
      setVisibleCount(prev => prev + loadMoreCount);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Search & Filter Section */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search campaigns..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-4 top-4 text-gray-400 text-xl" />
        </div>
        
        <select
          className="w-full md:w-48 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Education">Education</option>
          <option value="Sports">Sports</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Loading and error states */}
      {isLoading && <div className="text-center py-8 text-gray-500">Loading campaigns...</div>}
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}

      {/* Campaign Grid */}
      <InfiniteScroll
        dataLength={displayedCampaigns.length}
        next={loadMore}
        hasMore={hasMore}
        loader={displayedCampaigns.length > 0 && (
          <div className="text-center py-8 text-gray-500">Loading more campaigns...</div>
        )}
        endMessage={displayedCampaigns.length > 0 && (
          <p className="text-center py-8 text-gray-500">No more campaigns to show</p>
        )}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCampaigns.map((campaign: Campaign, index) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              index={index}
            />
          ))}
        </div>
      </InfiniteScroll>

      {/* Empty state */}
      {!isLoading && displayedCampaigns.length === 0 && allCampaigns.length > 0 && (
        <div className="text-center py-8 text-gray-500">No campaigns match your filters</div>
      )}
      
      {!isLoading && allCampaigns.length === 0 && (
        <div className="text-center py-8 text-gray-500">No campaigns available</div>
      )}
    </div>
  );
};

export default CampaignBrowsingPage;