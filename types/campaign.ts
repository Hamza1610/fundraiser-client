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