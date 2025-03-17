import { useState } from 'react';
import { useForm, UseFormRegister } from 'react-hook-form';
import { auth } from '../config/firebase'; // Configure Firebase first
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router'
import { FcGoogle } from 'react-icons/fc';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import 'react-toastify/dist/ReactToastify.css';
import { FormData } from '@/types/auth';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const [resetEmail, setResetEmail] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const router = useRouter()
  // Firebase Auth Handlers
  const handleEmailPasswordAuth = async (data: FormData) => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast.success('Successfully logged in!');
        // Redirect to campaign page
        setTimeout(() => router.push('/campaigns'), 4000);
      } else {
        if (data.password !== data.confirmPassword) {
          toast.error('Passwords do not match!');
          return;
        }
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        toast.success('Account created successfully!');
        // Redirect to campaign page
        setTimeout(() => router.push('/campaigns'), 4000);

      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Google authentication successful!');
      // Redirect to campaign page
      setTimeout(() => router.push('/campaigns'), 4000);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.info('Password reset email sent!');
      setShowResetModal(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <ToastContainer />
      
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h2>

        {/* Google Auth Button */}
        <button
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-900 py-3 rounded-lg 
                  hover:bg-blue-200 transition-colors mb-6"
        >
          <FcGoogle className="w-6 h-6" />
          Continue with Google
        </button>

        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit(handleEmailPasswordAuth)}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                {...register('name', { required: true })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              {...register('email', { required: true })}
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              {...register('password', { 
                required: true,
                minLength: 6 
              })}
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter password"
            />
          </div>

          {!isLogin && (
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                {...register('confirmPassword', { 
                  required: true,
                  validate: value => value === watch('password')
                })}
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Confirm password"
              />
            </div>
          )}

          {isLogin && (
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="text-blue-600 hover:text-blue-800 text-sm mb-4"
            >
              Forgot Password?
            </button>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Reset Password</h3>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border mb-4 rounded-lg"
            />
            <div className="flex gap-4">
              <button
                onClick={handlePasswordReset}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Send Reset Email
              </button>
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;