'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance);
}
