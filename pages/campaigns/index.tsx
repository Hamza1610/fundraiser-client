import CampaignBrowsingComponent from '@/components/CampaignBrowsingComponent'
import { CampaignAPI } from '@/helpers/apiClient';
import { Campaign } from '@/types/dataTypes';

// Server Component to fetch data
async function Page() {
  const campaignsList = await CampaignAPI.getCampaigns();
  let campaigns: Campaign[] = [];

  if (campaignsList.success) {
    campaigns = campaignsList.data?.data || [];
    console.log("Fpund campaings: ", campaigns);
    
  }

  return <CampaignBrowsingComponent initialCampaigns={campaigns} />;
}

export default Page;