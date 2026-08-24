import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { ClassroomLayout, UserProfile } from '../types';

let firebaseConfig: Record<string, string> = {
  projectId: "gen-lang-client-0776162995",
  appId: "1:826456077393:web:4f60372a9a83b20a63f470",
  apiKey: "AIzaSyBcX0eFLVTlb8Zi8sptLjib50K_Yyf2YjE",
  authDomain: "gen-lang-client-0776162995.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-25fd635a-1822-4fe4-96eb-05626d253e58",
  storageBucket: "gen-lang-client-0776162995.firebasestorage.app",
  messagingSenderId: "826456077393"
};

// Initialize Firebase safely
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  hd: 'montessori.edu.co' // Suggests or filters by the montessori domain
});

export const ALLOWED_DOMAIN = 'montessori.edu.co';

export function isAllowedDomain(email: string | null | undefined): boolean {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  return lower.endsWith(`@${ALLOWED_DOMAIN}`);
}

export async function loginWithGoogle(): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const email = user.email || '';

    // Check if domain is @montessori.edu.co
    const isDomainValid = isAllowedDomain(email);

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'Docente Montessori',
      photoURL: user.photoURL,
      isMontessoriDomain: isDomainValid,
    };

    if (!isDomainValid) {
      // If user logs in with non-montessori domain, sign them out with explanation
      await signOut(auth);
      return {
        user: null,
        error: `Acceso restringido: Solo se permiten correos institucionales @${ALLOWED_DOMAIN}. Tu cuenta (${email}) no tiene permisos.`
      };
    }

    return { user: profile };
  } catch (error: any) {
    console.error('Google Auth Error:', error);
    return { user: null, error: error.message || 'Error al iniciar sesión con Google' };
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Firestore Database operations
export async function saveClassroomToFirestore(userId: string, classroom: ClassroomLayout): Promise<boolean> {
  try {
    const cleanId = classroom.id || 'default-classroom';
    const docRef = doc(db, 'users', userId, 'classrooms', cleanId);
    
    // Convert object without undefined values for Firestore
    const dataToSave = {
      ...classroom,
      updatedAt: new Date().toISOString(),
      serverUpdated: serverTimestamp()
    };

    await setDoc(docRef, dataToSave, { merge: true });
    return true;
  } catch (err) {
    console.error('Firestore save error:', err);
    // Fallback to localStorage
    try {
      localStorage.setItem(`montessori_classroom_${classroom.id}`, JSON.stringify(classroom));
    } catch (e) {}
    return false;
  }
}

export async function loadUserClassrooms(userId: string): Promise<ClassroomLayout[]> {
  try {
    const colRef = collection(db, 'users', userId, 'classrooms');
    const snapshot = await getDocs(colRef);
    const classrooms: ClassroomLayout[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as ClassroomLayout;
      classrooms.push(data);
    });

    return classrooms;
  } catch (err) {
    console.error('Firestore load error:', err);
    return [];
  }
}

export async function deleteClassroomFromFirestore(userId: string, classroomId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'users', userId, 'classrooms', classroomId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Firestore delete error:', err);
    return false;
  }
}
