export interface Campaign {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string; // This is the image URL
  raised: number;
  goal: number;
}

export interface CampaignCardProps {
  campaign: Campaign;
  index: number;
}

// Donations Types Types
export interface Donation {
  id: number;
  campaign: string;
  amount: number;
  date: string;
  status: string;
}

// Saved Campaigns
export interface SavedCampaign {
  id: number;
  title: string;
  progress: number;
  image: string;
}