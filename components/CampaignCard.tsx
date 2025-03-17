// components/CampaignCard.tsx
import { foundedRangeColor } from '@/helpers/campaignAmountColor';
import { CampaignCardProps, Campaign } from '@/types/campaign';
import { motion } from 'framer-motion';
import Image from 'next/image';

const CampaignCard = ({ campaign, index }: CampaignCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <img
        src={campaign.image}
        alt={campaign.title}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-6">
        <span className="text-sm text-blue-600 font-semibold">
          {campaign.category}
        </span>
        <h3 className="text-xl font-bold text-gray-800 mt-2">
          {campaign.title}
        </h3>
        <p className="text-gray-600 mt-2">{campaign.description}</p>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm font-semibold text-gray-600">
            <span>Raised: ${campaign.raised.toLocaleString()}</span>
            <span>Goal: ${campaign.goal.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={"h-2 bg-"+foundedRangeColor(campaign.goal, campaign.raised)+"-400 rounded-full"}
              style={{
                width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%`
              }}
            />
          </div>
        </div>

        <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Donate Now
        </button>
      </div>
    </motion.div>
  );
};

export default CampaignCard;