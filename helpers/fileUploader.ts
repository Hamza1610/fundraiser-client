import axios from 'axios';


export const uploadImage = async (file: File) => {
    // Function to upload an image to the server using FormData
    // and return the image URL.
    // This function is used in the CampaignForm component to upload images to the server.

    try {
      if (!file) {
        throw new Error('No file provided');
      }

      if (!(file instanceof File)) {
        throw new Error('Provided value is not a file');
      }

      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post('/api/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.imageUrl; 
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Image upload failed');
      
    }
  };