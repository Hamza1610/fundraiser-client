import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const LandingPage = () => {
  const featuredCampaigns = [
    { id: 1, title: 'New Library Fund', progress: 65, goal: '$50,000' },
    { id: 2, title: 'Student Scholarship', progress: 40, goal: '$30,000' },
    { id: 3, title: 'Sports Facility', progress: 85, goal: '$75,000' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full">
        <div className="absolute inset-0">
          <Image
            src="/fundraiser-header-bg.jpg"
            alt="Campus Background"
            layout="fill"
            objectFit="cover"
            className="opacity-90"
          />
          <div className="absolute inset-0 bg-blue-900/70" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative h-full flex flex-col justify-center items-center text-center px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Support Your Campus,<br />Make a Difference!
          </h1>
          
          <div className="flex flex-row flex-wrap justify-center gap-4 mt-8">
            <Link href="/campaigns">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-yellow-400 text-blue-900 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full 
                          text-sm sm:text-base md:text-lg font-semibold shadow-lg whitespace-nowrap
                          min-w-[160px] sm:min-w-0"
              >
                Explore Campaigns
              </motion.button>
            </Link>
            
            <Link href="/auth">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-white text-blue-900 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full 
                          text-sm sm:text-base md:text-lg font-semibold shadow-lg whitespace-nowrap
                          min-w-[160px] sm:min-w-0"
              >
                Login/Sign Up
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
          Featured Campaigns
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-blue-100 relative">
                <Image
                  src={`/campaign-${campaign.id}.jpg`}
                  alt={campaign.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  {campaign.title}
                </h3>
                
                <div className="mb-4">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-yellow-400 rounded-full"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>{campaign.progress}% Funded</span>
                    <span>Goal: {campaign.goal}</span>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Donate Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-bold mb-4">CampusFund</h3>
            <p className="text-gray-300">
              Empowering campus communities through collective support
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-yellow-400">About Us</a></li>
              <li><a href="#" className="hover:text-yellow-400">Contact</a></li>
              <li><a href="#" className="hover:text-yellow-400">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
                <a href="#" className="hover:text-yellow-400">
                    <FaFacebook className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-yellow-400">
                    <FaTwitter className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-yellow-400">
                    <FaInstagram className="w-6 h-6" />
                </a>
            </div>
        </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;