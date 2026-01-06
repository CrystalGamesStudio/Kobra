import { auth } from '../firebase/config';
import { 
    GoogleAuthProvider, 
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInAnonymously as firebaseSignInAnonymously,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    type User
} from 'firebase/auth';

// Re-export the User type so components can import it from the service
export type { User };

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
};

export const signUpWithEmail = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = () => {
    return signOut(auth);
};

export const signInAnonymously = () => {
    return firebaseSignInAnonymously(auth);
};


// This new onAuthStateChanged function wraps the original from Firebase,
// automatically providing the 'auth' object. This simplifies its use in components.
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
    return firebaseOnAuthStateChanged(auth, callback);
};