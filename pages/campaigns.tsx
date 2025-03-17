import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FiSearch } from 'react-icons/fi';
import CampaignCard from '@/components/CampaignCard';


// Mock Data (20 campaigns)
const mockCampaigns = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Campaign ${i + 1}`,
  description: `Support our ${['Education', 'Sports', 'Infrastructure'][i % 3]} initiative`,
  category: ['Education', 'Sports', 'Infrastructure', 'Other'][i % 4],
  goal: Math.floor(Math.random() * 50000 + 50000),
  raised: Math.floor(Math.random() * 50000),
  image: `https://picsum.photos/400/300?random=${i}`
}));

const CampaignBrowsingPage = () => {
  const [items, setItems] = useState(mockCampaigns.slice(0, 8));
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filtered campaigns
  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || campaign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Load more data for infinite scroll
  const loadMore = () => {
    setTimeout(() => {
      setItems(prev => [
        ...prev,
        ...mockCampaigns.slice(prev.length, prev.length + 4)
      ]);
      if (items.length >= mockCampaigns.length) setHasMore(false);
    }, 1000);
  };

  // Debounce search
  useEffect(() => {
    const debounce = setTimeout(() => {
      setItems(filteredCampaigns.slice(0, 8));
      setHasMore(true);
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, selectedCategory]);

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

      {/* Campaign Grid */}
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<div className="text-center py-8 text-gray-500">Loading more campaigns...</div>}
        endMessage={<p className="text-center py-8 text-gray-500">No more campaigns to show</p>}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((campaign, index) => (
            <CampaignCard
                key={campaign.id}
                campaign={campaign}
                index={index}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default CampaignBrowsingPage;