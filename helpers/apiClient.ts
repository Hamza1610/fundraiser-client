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
      const response = await apiClient.post<Campaign>('/campaigns', data);
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  getCampaigns: async () => {
    try {
      const response = await apiClient.get<Campaign[]>('/campaigns');
      console.log("Cmapaigns: ", response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  getCampaign: async (id: string) => {
    try {
      const response = await apiClient.get<Campaign>(`/campaigns/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  updateCampaign: async (id: string, data: UpdateCampaignDTO) => {
    try {
      const response = await apiClient.put<Campaign>(`/campaigns/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  deleteCampaign: async (id: string) => {
    try {
      const response = await apiClient.delete<Campaign>(`/campaigns/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  }
};

// Comment API
export const CommentAPI = {
  createComment: async (campaignId: string, content: string) => {
    try {
      const response = await apiClient.post<Comment>(
        `/comments/campaigns/${campaignId}/comments`,
        { content }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  getComments: async (campaignId: string) => {
    try {
      const response = await apiClient.get<Comment[]>(
        `/comments/campaigns/${campaignId}/comments`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  deleteComment: async (id: string) => {
    try {
      const response = await apiClient.delete(`/comments/comments/${id}`);
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
      const response = await apiClient.post<Donation>(
        `/donations/campaigns/${campaignId}/donations`,
        { amount }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  getDonations: async (campaignId: string) => {
    try {
      const response = await apiClient.get<Donation[]>(
        `/donations/campaigns/${campaignId}/donations`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  updateDonationStatus: async (id: string, status: DonationStatus) => {
    try {
      const response = await apiClient.put<Donation>(
        `/donations/donations/${id}/status`,
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
      const response = await apiClient.post<SavedCampaign>('/saved', {
        campaignId
      });
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  getSavedCampaigns: async () => {
    try {
      const response = await apiClient.get<SavedCampaign[]>('/saved');
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  removeSavedCampaign: async (id: string) => {
    try {
      const response = await apiClient.delete<SavedCampaign>(`/saved/${id}`);
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