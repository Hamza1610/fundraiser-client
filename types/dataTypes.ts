export interface Campaign {
  _id: string | number;
  title: string;
  description: string;
  category: 'Education' | 'Sports' | 'Infrastructure' | 'Other';
  image: string; // This is the image URL
  raised: number;
  goal: number;
  updates: string[];
  creator: string;
}

export interface CampaignCardProps {
  campaign: Campaign;
  index: number;
}

// Donations Types Types
export interface Donation {
  _id: number | string;
  title: string;
  amount: number;
  date: string;
  status: string;
  // donorId: string;
}

// Saved Campaigns
export interface SavedCampaign {
  _id: string | number;
  title: string;
  progress: number;
  image: string;
  // Add a new field to the Campaign type to store the saver's user ID.
  // savedBy: string;
}

export interface Comment {
  author: string;
  content: string;
  timestamp: Date | string;
  campaignId?: string;
}


// DTO Types
export interface CreateCampaignDTO {
  _id?: string | number
  title: string;
  description: string;
  category: 'Education' | 'Sports' | 'Infrastructure' | 'Other';
  goal: number;
  image: string;
  creatorId: string;
}

export interface UpdateCampaignDTO extends Partial<CreateCampaignDTO> {}