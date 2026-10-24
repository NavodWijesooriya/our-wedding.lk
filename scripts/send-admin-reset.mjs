import { initializeApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCMIzkU_qLt04oaNnm-0os7ZMgu8u7S-rs",
  authDomain: "weddingsites-8d0bb.firebaseapp.com",
  projectId: "weddingsites-8d0bb",
  storageBucket: "weddingsites-8d0bb.firebasestorage.app",
  messagingSenderId: "475848886423",
  appId: "1:475848886423:web:d5e4d95b78746649f601d2",
  measurementId: "G-8VWR0X0SR2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = 'navodtwijesooriya@gmail.com';

async function main() {
  console.log(`Sending password reset email to: ${email}`);
  await sendPasswordResetEmail(auth, email);
  console.log(`Successfully sent password reset email to ${email}!`);
  console.log('Please check your inbox (and spam folder) for the password reset link from Firebase.');
}

main().catch((err) => {
  console.error('Password reset email error:', err.message, err.code);
});
