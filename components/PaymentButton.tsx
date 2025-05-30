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
  donorId: string;
  onSuccess: (ref: any) => void;
}

export const PaystackButtonWrapper = ({
  amount,
  email,
  campaignId,
  donorId,
  onSuccess,
}: Props) => {
  const config = {
    reference: `${+new Date()}`,     // unique transaction reference
    email,
    amount: amount * 100,            // convert Naira to Kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    metadata: { campaignId, donorId },
  };

  // Optional: override styles if needed
  const style: CSSProperties = { width: '100%', background: '#1E40AF', color: '#FFF' };

  return (
    <PaystackButton
      {...config}
      text="Donate Now"
      className="py-3 rounded-lg"
      style={style}
      onSuccess={onSuccess}
      onClose={() => alert('Payment window closed')}
    />
  );
};
