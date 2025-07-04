// pages/campaigns/[id].tsx
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
// import { Elements, PaymentElement } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
import { useForm } from 'react-hook-form';
import io from 'socket.io-client';
import { LoadingSpinner } from '@/components/LoadingComponent';
import { foundedRangeColor } from '@/helpers/campaignAmountColor';
import apiClient from '@/config/axios';
import axios from 'axios';
import { Campaign } from '@/types/dataTypes';
import { CampaignAPI, CommentAPI, DonationAPI } from '../../helpers/apiClient/apiClient'
import { PaystackButtonWrapper } from '@/components/PaymentButton';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/config/firebase';
// Add at top


// Mock Data (same as browsing page)
// const mockCampaigns = Array.from({ length: 20 }, (_, i) => ({
//   id: i + 1,
//   title: `Campaign ${i + 1}`,
//   description: `Support our ${['Education', 'Sports', 'Infrastructure'][i % 3]} initiative. This campaign aims to ${['build new facilities', 'provide scholarships', 'upgrade equipment'][i % 3]}.`,
//   category: ['Education', 'Sports', 'Infrastructure', 'Other'][i % 4],
//   goal: Math.floor(Math.random() * 50000 + 50000),
//   raised: Math.floor(Math.random() * 50000),
//   image: `https://picsum.photos/800/600?random=${i}`,
//   updates: [
//     `Update ${i + 1}: Campaign launched successfully!`,
//     `Update ${i + 2}: First milestone reached!`
//   ]
// }));
// Test
// Stripe Setup
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const CampaignDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState<any>(null);
  const [donations, setDonations] = useState<number>(0);
  const [comments, setComments] = useState<any[]>([]);
  const { register, handleSubmit, reset } = useForm();
  const [ clientSecret, setClientSecret ] = useState<string>(process.env.STRIPE_SECRET_KEY!);
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  
  // Simulate WebSocket updates
  // useEffect(() => {
  //   const socket = io('http://localhost:3003'); // Replace with your WS server
    
  //   socket.on('donationUpdate', (newDonation: number) => {
  //     setDonations(prev => prev + newDonation);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // Load campaign data
  useEffect(() => {
    if (id) {
      // const foundCampaign = mockCampaigns.find(c => c.id === Number(id));
      // setCampaign(foundCampaign);
      // setDonations(foundCampaign?.raised || 0);

      const fetchCampaign = async () => {
        try {
          console.log('Fetching campaign with ID:', id);
          // const response = await axios.get(`/api/campaigns/${id}`);
          // const response = await apiClient.get(`/api/campaigns/67f290c819ab344c5961930b`);
          // const foundCampaign: Campaign = response.data.data;
          const foundCampaign = await CampaignAPI.getCampaign(id);
          if (foundCampaign.success) {
            const data = foundCampaign.data?.data;
            console.log(" Found Campaign: ",  data);
            setCampaign(data);
            setDonations(data.raised || 0);
            return
          }
          toast.error(`Error fetching campaign`);

        } catch (error) {
          console.error('Error fetching campaign:', error);
          toast.error('Failed to fetch campaign data');
          
        }
      }

      const fetchComments = async () => {
        try {
          const comments = await CommentAPI.getComments(router.query.id as string);
          
          console.log("Found comments: ", comments);
          
          if(comments.success) {
            const data = (await comments).data?.data;
            console.log("Found Comments: ", data);
            setComments(data)
          }
        } catch (error) {
          console.error('Error fetching Comment:', error);
          toast.error('Failed to fetch comment data');
        }
      }
      
      // Fetch campaign data from the server
      const getClientKey = async () => {
        try {
          const response = await axios.get('/api/get-payment-intent-key');
          if (response.data.clientSecret) {
            setClientSecret(response.data.clientSecret);
          } else {
            toast.error('Client secret not found');
          }
        } catch (error) {
          console.error('Axios Error:', error);
          toast.error('Network error: Could not connect to server');
        }
      };
      getClientKey();
      fetchCampaign();
      fetchComments();
    }
  }, [id]);

  // Add this useEffect to get the current user
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle comment submission
  const onSubmitComment = (data: any) => {
  // save comment to database
    CommentAPI.createComment(campaign._id, data.comment);

    setComments([...comments, {
      id: comments.length + 1,
      author: 'User',
      content: data.comment,
      timestamp: new Date().toISOString()
    }]);
    reset();
  };

  if (!campaign) return <div className="text-center py-20"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <ToastContainer />

      {/* Campaign Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-96 w-full rounded-xl overflow-hidden"
      >
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-6">
          <h1 className="text-4xl font-bold text-white">{campaign.title}</h1>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
            <div
              className={"bg-"+foundedRangeColor(campaign.goal, campaign.raised)+"-600 h-4 rounded-full"}
              style={{
                width: `${Math.min(((campaign.raised + donations) / campaign.goal) * 100, 100)}%`
              }}
            />
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About this Campaign</h2>
            <p className="text-gray-700 leading-relaxed">{campaign.description}</p>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Updates</h3>
              {campaign.updates.map((update: string, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg mb-3">
                  <p className="text-gray-700">{update}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments ({comments.length})</h3>
              <form onSubmit={handleSubmit(onSubmitComment)} className="mb-6">
                <textarea
                  {...register('comment', { required: true })}
                  className="w-full p-3 border rounded-lg text-gray-700"
                  placeholder="Add a comment..."
                  rows={3}
                />
                <button
                  type="submit"
                  className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Post Comment
                </button>
              </form>
              {comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg mb-3">
                  <p className="font-medium text-gray-800">{comment.author}</p>
                  <p className="text-gray-700">{comment.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {(clientSecret)  && (
        // {/* Donation Sidebar */}
        <div className="lg:col-span-1">
          {/* <motion.div
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg sticky top-8"
          >

            <Elements options={options} stripe={stripePromise}>
              <PaymentElement />
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-blue-600">
                    ${(campaign.raised + donations).toLocaleString()}
                  </h3>
                  <p className="text-gray-600">raised of ${campaign.goal.toLocaleString()} goal</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full p-3 border rounded-lg"
                  />
                  <button
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                    onClick={() => toast.success('Donation successful! (Simulated)')}
                  >
                    Donate Now
                  </button>
                </div>

                <div className="text-sm text-gray-500">
                  <p>Secure payment processing powered by Stripe</p>
                </div>
              </div>
            </Elements>
          </motion.div> */}
          {/* Donation Sidebar */}
<div className="lg:col-span-1">
  <motion.div
    initial={{ x: 20 }}
    animate={{ x: 0 }}
    className="bg-white rounded-xl p-6 shadow-lg sticky top-8"
  >
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-blue-600">
          ${(campaign.raised + donations).toLocaleString()}
        </h3>
        <p className="text-gray-700">raised of ${campaign.goal.toLocaleString()} goal</p>
      </div>

      {!user ? (
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <p className="text-yellow-800">Please log in to make a donation</p>
          <button 
            onClick={() => router.push('/auth')}
            className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Log in
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full p-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={donationAmount}
            onChange={(e) => setDonationAmount(Number(e.target.value))}
          />
          <PaystackButtonWrapper
            amount={donationAmount}
            email={user?.email || "donor@example.com"}
            campaignId={campaign._id}
            onSuccess={async (ref) => {
              try {
                await CampaignAPI.updateCampaignFund(campaign._id, donationAmount);

                await DonationAPI.createDonation({
                  amount: donationAmount,
                  campaignId: campaign._id,
                  creatorId: campaign.creatorId,
                  reference: ref.reference,
                });
                toast.success('Donation successful!');
                setDonations(prev => prev + donationAmount);
              } catch (error) {
                console.error('Error processing donation:', error);
                toast.error('Failed to process donation');
              }
            }}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          />
        </div>
      )}

      <div className="text-sm text-gray-600">
        <p>Secure payment powered by Paystack</p>
      </div>
    </div>
  </motion.div>
</div>

        </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetails;