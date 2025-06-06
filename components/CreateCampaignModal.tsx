import { useState, FormEvent, ChangeEvent } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import axios from 'axios';
import { uploadImage } from '@/helpers/fileUploader';
import { log } from 'console';
import { CampaignAPI } from '@/helpers/apiClient/apiClient';
import { toast } from 'react-toastify';

// Define the campaign type
interface CampaignFormData {
  title: string;
  category: string;
  goal: number;
  description: string;
  image: File | null;
}

interface CreateCampaignModalProps {
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  onCampaignCreated?: () => void;
}

export default function CreateCampaignModal({ 
  showCreateModal, 
  setShowCreateModal,
  onCampaignCreated
}: CreateCampaignModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CampaignFormData>({
    title: '',
    category: 'Education',
    goal: 0,
    description: '',
    image: null
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'goal' ? Number(value) : value
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0]
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create a FormData object to handle file uploads
      // const formDataToSend = new FormData();
      // formDataToSend.append('title', formData.title);
      // formDataToSend.append('category', formData.category);
      // formDataToSend.append('goal', formData.goal.toString());
      // formDataToSend.append('description', formData.description);
      const formDataToSend: any = {};
      formDataToSend['title'] = formData.title;
      formDataToSend['category'] = formData.category;
      formDataToSend['goal'] = formData.goal.toString();
      formDataToSend['description'] = formData.description;
      if (formData.image) {
        const imageUrl: string = await uploadImage(formData.image); // Assuming you have a function to handle image upload
        // const imageUrl: string = "https://random-pictures/campaign-3.jpg" // Assuming you have a function to handle image upload
        console.log('Image URL:', imageUrl);
        if (imageUrl) {
          // formDataToSend.append('image', imageUrl);
          formDataToSend['image'] = imageUrl;
        }
      }
      
      // Send the data to the server
      // await axios.post('/api/campaigns', formDataToSend, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });

      const response = await CampaignAPI.createCampaign(formDataToSend);
      
      if (response.success) {
        // Reset form and close modal
        setFormData({
          title: '',
          category: 'Education',
          goal: 0,
          description: '',
          image: null
        });
        setShowCreateModal(false);
        toast.success("Capaign created successfully!")
        // Notify parent component about the new campaign
        if (onCampaignCreated) {
          onCampaignCreated();
        }        
      }


    } catch (err) {
      console.error('Error creating campaign:', err);
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
      toast.error("Error occured creating new campaign")
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showCreateModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Create New Campaign</h3>
          <button 
            onClick={() => setShowCreateModal(false)}
            className="text-gray-700 hover:text-gray-900"
            type="button"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-1">Title</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg text-gray-900 placeholder-gray-500"
              placeholder="Campaign title"
              required
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-1">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg text-gray-900"
              required
            >
              <option value="Education">Education</option>
              <option value="Sports">Sports</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-900 mb-1">Goal Amount ($)</label>
            <input
              id="goal"
              name="goal"
              type="number"
              value={formData.goal}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg text-gray-900"
              min="0"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">Enter fund description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg text-gray-900"
              rows={4}
              required
            ></textarea>
          </div>
            
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-900 mb-1">Upload fund picture</label>
            <input
              id="image"
              name="image"
              type="file"
              accept=".png, .jpg, .jpeg, .webp"
              className="w-full p-2 border rounded-lg text-gray-900"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:bg-blue-400"
            >
              {isSubmitting ? 'Creating...' : (
                <>
                  <FiSave className="w-4 h-4" /> Create Campaign
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}