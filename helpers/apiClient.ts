// lib/apiClient.ts
import apiClient from '@/config/axios';
import axios, { AxiosError } from 'axios';
import { Campaign, Comment, Donation, SavedCampaign, CreateCampaignDTO, UpdateCampaignDTO } from '@/types/dataTypes';
import { log } from 'console';
// Add auth token interceptor
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Campaign API
export const CampaignAPI = {
  createCampaign: async (data: CreateCampaignDTO) => {
    try {
      const response = await axios.post<Campaign>('/api/campaigns', data);
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  getCampaigns: async () => {
    try {
      const response = await axios.get<Campaign[]>('/api/campaigns');
      console.log("Cmapaigns: ", response.data);
    
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  getCampaign: async (id: string | string[] ) => {
    try {
      const response = await axios.get<Campaign>(`/api/campaigns/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  updateCampaign: async (id: string, data: UpdateCampaignDTO) => {
    try {
      const response = await axios.put<Campaign>(`/api/campaigns/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  deleteCampaign: async (id: string) => {
    try {
      const response = await axios.delete<Campaign>(`/api/campaigns/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  }
};

// Comment API
export const CommentAPI = {
  createComment: async (campaignId: string | string[], content: string) => {
    try {
      const response = await axios.post<Comment>(
        `/api/comments/campaigns/${campaignId}/comments`,
        { content }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  getComments: async (campaignId: string) => {
    try {
      const response = await axios.get<Comment[]>(
        `/api/comments/campaigns/${campaignId}/comments`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  deleteComment: async (id: string) => {
    try {
      const response = await axios.delete(`/api/comments/comments/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  }
};

// Donation API
export const DonationAPI = {
  createDonation: async (campaignId: string, amount: number) => {
    try {
      const response = await axios.post<Donation>(
        `/api/donations/campaigns/${campaignId}/donations`,
        { amount }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  getDonations: async (campaignId: string) => {
    try {
      const response = await axios.get<Donation[]>(
        `/api/donations/campaigns/${campaignId}/donations`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  updateDonationStatus: async (id: string, status: DonationStatus) => {
    try {
      const response = await axios.put<Donation>(
        `/api/donations/donations/${id}/status`,
        { status }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  }
};

// Saved Campaign API
export const SavedCampaignAPI = {
  saveCampaign: async (campaignId: string) => {
    try {
      const response = await axios.post<SavedCampaign>('/api/saved', {
        campaignId
      });
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  getSavedCampaigns: async () => {
    try {
      const response = await axios.get<SavedCampaign[]>('/api/saved');
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  removeSavedCampaign: async (id: string) => {
    try {
      const response = await axios.delete<SavedCampaign>(`/api/saved/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  }
};

// Utility Types
type APIResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

type DonationStatus = 'Completed' | 'Processing' | 'Failed';

// Error handler
const handleError = <T>(error: unknown): APIResponse<T> => {
  if (error instanceof AxiosError) {
    return {
      success: false,
      error: error.response?.data?.error || 'Request failed'
    };
  }
  return { success: false, error: 'An unexpected error occurred' };
};