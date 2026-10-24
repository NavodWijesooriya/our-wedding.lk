import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

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
const db = getFirestore(app);

const email = 'navodtwijesooriya@gmail.com';
const defaultPassword = process.argv[2] || 'Admin@123456';
const displayName = 'Navod Wijesooriya (Admin)';

async function main() {
  console.log(`Checking status for: ${email}`);

  let userCred = null;

  try {
    // 1. Try to create user
    userCred = await createUserWithEmailAndPassword(auth, email, defaultPassword);
    console.log(`User created successfully with UID: ${userCred.user.uid}`);
    await updateProfile(userCred.user, { displayName });
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log('User already exists in Firebase Auth. Attempting to sign in with provided password...');
      try {
        userCred = await signInWithEmailAndPassword(auth, email, defaultPassword);
        console.log(`Successfully signed in with UID: ${userCred.user.uid}`);
      } catch (signInErr) {
        console.log(`Account exists in Firebase Auth, but password '${defaultPassword}' did not match: ${signInErr.message}`);
        console.log('You can either log in with your existing password, or reset it at http://localhost:3000/forgot-password');
        process.exit(0);
      }
    } else {
      console.error('Firebase Auth error:', err.message, err.code);
      process.exit(1);
    }
  }

  if (userCred?.user) {
    const uid = userCred.user.uid;
    console.log(`Setting admin role and approved status in Firestore for UID: ${uid}`);

    try {
      await setDoc(doc(db, 'users', uid), {
        uid,
        email: email.toLowerCase(),
        displayName,
        role: 'admin',
        status: 'approved',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      console.log('Admin user profile successfully created and approved in Cloud Firestore!');
      console.log('--------------------------------------------------');
      console.log(`Email:    ${email}`);
      console.log(`Password: ${defaultPassword}`);
      console.log(`Role:     admin`);
      console.log(`Status:   approved`);
      console.log('--------------------------------------------------');
    } catch (dbErr) {
      console.error('Firestore save error:', dbErr.message);
    }
  }
}

main().catch(console.error);
