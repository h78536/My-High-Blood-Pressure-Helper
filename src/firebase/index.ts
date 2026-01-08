'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// This is a guard to make sure we're only executing this on the client
const IS_CLIENT = typeof window !== 'undefined';

interface FirebaseServices {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

export function initializeFirebase(): FirebaseServices {
  // If we're on the server, return null services to avoid build errors.
  if (!IS_CLIENT) {
    return {
      firebaseApp: null,
      auth: null,
      firestore: null,
    };
  }
  
  if (getApps().length) {
    return getSdks(getApp());
  }
  
  const firebaseApp = initializeApp(firebaseConfig);
  
  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp): FirebaseServices {
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
