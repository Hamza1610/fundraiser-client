import { Campaign } from '@/types/dataTypes';
import CampaignBrowsingComponent from '@/components/CampaignBrowsingComponent';
import { CampaignAPI } from '@/helpers/apiClient/apiClient';

// Parent stays as-is, passing campaignsFunc prop:
export default function Page() {
  const getCampaigns = async () => {
    const response = await CampaignAPI.getCampaigns();
    if (response.success) {
      console.log('Fetched campaigns:', response.data.data);
      return response.data.data;
    } else {
      console.error('Error fetching campaigns:', response);
      return []; // Return an empty array on error
    }
  };
  return <CampaignBrowsingComponent campaignsFunc={getCampaigns} />;
}