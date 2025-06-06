// components/PaystackButtonWrapper.tsx
import dynamic from 'next/dynamic';
import { CSSProperties } from 'react';

// Dynamically import the PaystackButton from react-paystack
const PaystackButton = dynamic(
  () => import('react-paystack').then(mod => mod.PaystackButton),
  { ssr: false }
);

interface Props {
  amount: number;
  email: string;
  campaignId: string;
  onSuccess: (ref: any) => void;
  className?: string;
}

export const PaystackButtonWrapper = ({
  amount,
  email,
  campaignId,
  onSuccess,
  className = '',
}: Props) => {
  const config = {
    reference: `${+new Date()}`,     // unique transaction reference
    email,
    amount: amount * 100,            // convert Naira to Kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    metadata: { campaignId },
  };

  // Default button styles
  const defaultStyle: CSSProperties = {
    width: '100%',
    background: '#2563EB', // blue-600
    color: '#FFFFFF',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  return (
    <PaystackButton
      {...config}
      text="Donate Now"
      className={`${className} hover:bg-blue-700 transition-colors duration-200`}
      style={defaultStyle}
      onSuccess={onSuccess}
      onClose={() => alert('Payment window closed')}
    />
  );
};
