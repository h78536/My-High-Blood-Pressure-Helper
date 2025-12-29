'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// IMPORTANT: This function initializes Firebase using the config from environment variables.
export function initializeFirebase() {
  if (getApps().length) {
    return getSdks(getApp());
  }
  
  // Always initialize with the config object, which now reads from process.env.
  // This works for both local development (with .env.local) and deployed environments (like Cloudflare).
  const firebaseApp = initializeApp(firebaseConfig);
  
  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
