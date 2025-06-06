import { Campaign } from '@/types/dataTypes';
import CampaignBrowsingComponent from '@/components/CampaignBrowsingComponent';
import { CampaignAPI } from '@/helpers/apiClient/apiClient';

// Parent stays as-is, passing campaignsFunc prop:
export default function Page() {
  const getCampaigns = async () => {
    try {
      const response = await CampaignAPI.getCampaigns();
      if (response.success && Array.isArray(response.data.data)) {
        console.log('Fetched campaigns:', response.data.data);
        return response.data.data;
      } else {
        console.error('Invalid response format:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  };
  return <CampaignBrowsingComponent campaignsFunc={getCampaigns} />;
}