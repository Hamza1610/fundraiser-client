// // middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   const uid = request.cookies.get('uid')?.value;
  
//   console.log("Middleware UID: ", uid);
  
//   const response = NextResponse.next();

//   if (uid) {
//     response.headers.set('x-firebase-uid', uid);
//   }

//   response.headers.set(
//     'Content-Security-Policy',
//     "default-src 'self'; " +
//     "script-src 'self' https://js.stripe.com https://apis.google.com https://*.firebaseapp.com https://*.gstatic.com blob: 'unsafe-inline'; " +
//     "connect-src 'self' https://api.stripe.com https://identitytoolkit.googleapis.com https://*.googleapis.com https://*.firebaseapp.com; " +
//     "frame-src 'self' https://js.stripe.com  https://m.stripe.com https://hooks.stripe.com https://*.firebaseapp.com; " +
//     "style-src 'self' 'unsafe-inline';" +
//     "img-src 'self' https://*.cloudinary.com https://*.picsum.com https://*.googleapis.com https://*.firebaseapp.com https://*.googleusercontent.com https://randomuser.me/api/portraits/men/1.jpg; "
//   );
  
//   return response;
// }


// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { setFirebaseUID } from './config/firebase';

export async function middleware(request: NextRequest) {

  // the set-firebase-uid function is used here for every incoming request so that it set uid for authenticated user

  const uid = request.cookies.get('uid')?.value;
  
  console.log("Middleware UID: ", uid);

  if (!uid) return null;
  const response = NextResponse.next();

  // if (uid) {
  //   response.headers.set('x-firebase-uid', uid);
  // }

  // Updated Content Security Policy to include Paystack domains
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' https://js.stripe.com https://apis.google.com https://*.firebaseapp.com https://*.gstatic.com blob: 'unsafe-inline' https://js.paystack.co; " +
    "connect-src 'self' https://api.stripe.com https://identitytoolkit.googleapis.com https://*.googleapis.com https://*.firebaseapp.com https://api.paystack.co; " +
    "frame-src 'self' https://js.stripe.com https://m.stripe.com https://hooks.stripe.com https://*.firebaseapp.com https://checkout.paystack.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' https://*.cloudinary.com https://*.picsum.com https://*.googleapis.com https://*.firebaseapp.com https://*.googleusercontent.com https://randomuser.me/api/portraits/men/1.jpg;"
  );
  
  return response;
}

export const config = {
  matcher: ['/:path*'],
};
