// pages/campaigns/[id].tsx
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useForm } from 'react-hook-form';
import io from 'socket.io-client';
import { LoadingSpinner } from '@/components/LoadingComponent';
import { foundedRangeColor } from '@/helpers/campaignAmountColor';

// Mock Data (same as browsing page)
const mockCampaigns = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Campaign ${i + 1}`,
  description: `Support our ${['Education', 'Sports', 'Infrastructure'][i % 3]} initiative. This campaign aims to ${['build new facilities', 'provide scholarships', 'upgrade equipment'][i % 3]}.`,
  category: ['Education', 'Sports', 'Infrastructure', 'Other'][i % 4],
  goal: Math.floor(Math.random() * 50000 + 50000),
  raised: Math.floor(Math.random() * 50000),
  image: `https://picsum.photos/800/600?random=${i}`,
  updates: [
    `Update ${i + 1}: Campaign launched successfully!`,
    `Update ${i + 2}: First milestone reached!`
  ]
}));

// Stripe Setup
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const CampaignDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState<any>(null);
  const [donations, setDonations] = useState<number>(0);
  const [comments, setComments] = useState<any[]>([]);
  const { register, handleSubmit, reset } = useForm();

  // Simulate WebSocket updates
  useEffect(() => {
    const socket = io('http://localhost:3001'); // Replace with your WS server
    
    socket.on('donationUpdate', (newDonation: number) => {
      setDonations(prev => prev + newDonation);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Load campaign data
  useEffect(() => {
    if (id) {
      const foundCampaign = mockCampaigns.find(c => c.id === Number(id));
      setCampaign(foundCampaign);
      setDonations(foundCampaign?.raised || 0);
    }
  }, [id]);

  // Handle comment submission
  const onSubmitComment = (data: any) => {
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
            <p className="text-gray-600">{campaign.description}</p>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Updates</h3>
              {campaign.updates.map((update: string, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg mb-3">
                  {update}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>
              <form onSubmit={handleSubmit(onSubmitComment)} className="mb-6">
                <textarea
                  {...register('comment', { required: true })}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Add a comment..."
                  rows={3}
                />
                <button
                  type="submit"
                  className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Post Comment
                </button>
              </form>
              {comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg mb-3">
                  <p className="font-medium">{comment.author}</p>
                  <p className="text-gray-600">{comment.content}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Donation Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg sticky top-8"
          >
            <Elements stripe={stripePromise}>
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;