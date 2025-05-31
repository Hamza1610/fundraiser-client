// 




import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const LandingPage = () => {
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
                className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-full 
                          text-lg font-semibold shadow-lg"
              >
                Explore Campaigns
              </motion.button>
            </Link>
            
            <Link href="/auth">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-white text-blue-900 px-6 py-3 rounded-full 
                          text-lg font-semibold shadow-lg"
              >
                Login/Sign Up
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-6">About CampusFund</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          CampusFund is a platform built to empower university communities to raise funds for important projects. 
          Whether it's building new facilities, supporting scholarships, or launching innovative ideas every campaign counts.
        </p>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto text-left">
          {[
            {
              title: 'Start a Campaign',
              description: 'Create a campaign to raise funds for a specific cause on your campus.',
              icon: '🎯',
            },
            {
              title: 'Share with Community',
              description: 'Promote your campaign through social media and student groups.',
              icon: '📣',
            },
            {
              title: 'Reach Your Goal',
              description: 'Collect donations, track progress, and celebrate your success.',
              icon: '🏆',
            },
          ].map((step, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-12">What Our Supporters Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              quote: "CampusFund helped us renovate our old library. The community support was overwhelming!",
              name: "Sarah L.",
              title: "Student Council President",
            },
            {
              quote: "We raised $20,000 for new lab equipment in just 3 weeks. Amazing platform!",
              name: "Dr. Thomas K.",
              title: "Chemistry Department Head",
            },
          ].map((testimonial, index) => (
            <div key={index} className="bg-gray-100 p-6 rounded-xl shadow">
              <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
              <p className="font-bold text-blue-900">{testimonial.name}</p>
              <p className="text-sm text-gray-600">{testimonial.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-blue-900 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Start your campaign today or explore those already making an impact.
        </p>
        <Link href="/campaigns">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full 
                      text-lg font-semibold shadow-lg"
          >
            Get Started
          </motion.button>
        </Link>
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
