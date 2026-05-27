// src/data/firebaseData.ts
import { 
  db, auth, storage 
} from '../config/firebase';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, 
  query, where, orderBy, limit, addDoc, Timestamp, onSnapshot,
  writeBatch, arrayUnion, arrayRemove, increment
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword,
  signOut, onAuthStateChanged
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

// ==================== TYPY ====================

export interface User {
  id: string;
  name: string;
  initials: string;
  email: string;
  avatarColor: string;
  avatarUrl?: string;
  memberSince: string;
  neighborhood: string;
  bio: string;
  impactScore: number;
  exchangesCount: number;
  communityHealth: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Listing {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerInitials: string;
  ownerAvatarColor: string;
  title: string;
  description: string;
  imageUrl: string;
  status: 'active' | 'completed' | 'pending';
  category: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  views: number;
  interestedCount: number;
  listingType: 'offer' | 'request';
  suggestedBarter?: string;
  suggestedPoints?: number;
  completedWithUserId?: string;
  completedAt?: Timestamp;
}

export interface Application {
  id?: string;
  userId: string;
  userName: string;
  userInitials: string;
  userAvatarColor: string;
  message: string;
  appliedAt: Timestamp;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Conversation {
  id: string;
  participants: string[];
  participantsData: {
    id: string;
    name: string;
    initials: string;
    avatarColor: string;
  }[];
  listingId: string;
  listingTitle: string;
  lastMessage: string;
  lastMessageTime: Timestamp;
  unreadFor: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  fromUserId: string;
  fromUserName: string;
  fromUserInitials: string;
  fromUserAvatarColor: string;
  text: string;
  timestamp: Timestamp;
  read: boolean;
}

export interface ActivityItem {
  id: string;
  listingId: string;
  listingTitle: string;
  userId: string;
  userName: string;
  userInitials: string;
  userAvatarColor: string;
  userAvatarUrl?: string;
  action: 'created_offer' | 'created_request' | 'completed_exchange';
  timestamp: Timestamp;
  likes: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'new_application' | 'application_accepted' | 'application_rejected' | 'listing_completed' | 'new_message';
  title: string;
  message: string;
  read: boolean;
  createdAt: Timestamp;
  listingId?: string;
  fromUserId?: string;
  conversationId?: string;
}

// ==================== AUTH ====================

let currentFirebaseUser: User | null = null;
let authListeners: ((user: User | null) => void)[] = [];

export const onAuthChange = (callback: (user: User | null) => void) => {
  authListeners.push(callback);
  return () => {
    authListeners = authListeners.filter(cb => cb !== callback);
  };
};

const notifyAuthChange = (user: User | null) => {
  currentFirebaseUser = user;
  authListeners.forEach(cb => cb(user));
};

// Inicjalizacja nasłuchiwania autoryzacji
onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    const userDoc = await getUserById(firebaseUser.uid);
    if (userDoc) {
      notifyAuthChange(userDoc);
    } else {
      notifyAuthChange(null);
    }
  } else {
    notifyAuthChange(null);
  }
});

export const signUp = async (email: string, password: string, name: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;
  
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const avatarColors = [
    'from-[#7dd3c0] to-[#a8d5ba]',
    'from-[#89cff0] to-[#7dd3c0]',
    'from-[#a8d5ba] to-[#c2e7d9]',
  ];
  const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
  
  const newUser: User = {
    id: firebaseUser.uid,
    name,
    initials,
    email,
    avatarColor,
    memberSince: new Date().toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' }),
    neighborhood: 'Śródmieście, Gdynia',
    bio: 'Witaj w LocalLoop! 🌱 Razem budujemy lepszą społeczność.',
    impactScore: 0,
    exchangesCount: 0,
    communityHealth: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  
  await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
  notifyAuthChange(newUser);
  return newUser;
};

export const signIn = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;
  const userDoc = await getUserById(firebaseUser.uid);
  if (!userDoc) throw new Error('User not found');
  notifyAuthChange(userDoc);
  return userDoc;
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
  notifyAuthChange(null);
};

export const getCurrentUser = (): User | null => currentFirebaseUser;

export const isLoggedIn = (): boolean => currentFirebaseUser !== null;

// ==================== USERS ====================

export const getUserById = async (userId: string): Promise<User | null> => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as User) : null;
};

export const getAllUsers = async (): Promise<User[]> => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map(doc => doc.data() as User);
};

export const updateUserImpactScore = async (
  userId: string, 
  points: number, 
  action: string = 'earned', 
  target?: string
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    impactScore: increment(points),
    updatedAt: Timestamp.now(),
  });
  
  // Dodanie wpisu do historii punktów (opcjonalnie)
  const pointsHistoryRef = collection(db, 'users', userId, 'pointsHistory');
  await addDoc(pointsHistoryRef, {
    points,
    action,
    target: target || null,
    timestamp: Timestamp.now(),
  });
};

// ==================== LISTINGS ====================

export const getListings = async (): Promise<Listing[]> => {
  const listingsRef = collection(db, 'listings');
  const snapshot = await getDocs(listingsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
};

export const getListingById = async (id: string): Promise<Listing | null> => {
  const docRef = doc(db, 'listings', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Listing) : null;
};

export const getOffers = async (): Promise<Listing[]> => {
  const listingsRef = collection(db, 'listings');
  // Tymczasowo bez orderBy – dodaj indeks później
  const q = query(
    listingsRef, 
    where('listingType', '==', 'offer'),
    where('status', '==', 'active')
  );
  const snapshot = await getDocs(q);
  const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
  // Sortuj w JavaScript
  return listings.sort((a, b) => {
    const dateA = a.createdAt?.toDate?.()?.getTime() || 0;
    const dateB = b.createdAt?.toDate?.()?.getTime() || 0;
    return dateB - dateA;
  });
};

export const getRequests = async (): Promise<Listing[]> => {
  const listingsRef = collection(db, 'listings');
  const q = query(
    listingsRef, 
    where('listingType', '==', 'request'),
    where('status', '==', 'active')
  );
  const snapshot = await getDocs(q);
  const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
  return listings.sort((a, b) => {
    const dateA = a.createdAt?.toDate?.()?.getTime() || 0;
    const dateB = b.createdAt?.toDate?.()?.getTime() || 0;
    return dateB - dateA;
  });
};

export const getListingsByUser = async (userId: string): Promise<Listing[]> => {
  const listingsRef = collection(db, 'listings');
  const q = query(listingsRef, where('ownerId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
};

export const getActiveListingsByUser = async (userId: string): Promise<Listing[]> => {
  const listingsRef = collection(db, 'listings');
  // USUŃ orderBy jeśli nie masz indeksu – najpierw where, potem sortuj w JS
  const q = query(listingsRef, where('ownerId', '==', userId), where('status', '==', 'active'));
  const snapshot = await getDocs(q);
  const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
  // Sortuj w JavaScript zamiast w zapytaniu
  return listings.sort((a, b) => {
    const dateA = a.createdAt?.toDate?.()?.getTime() || 0;
    const dateB = b.createdAt?.toDate?.()?.getTime() || 0;
    return dateB - dateA;
  });
};

export const getCompletedListingsByUser = async (userId: string): Promise<Listing[]> => {
  const listingsRef = collection(db, 'listings');
  const q = query(listingsRef, where('ownerId', '==', userId), where('status', '==', 'completed'));
  const snapshot = await getDocs(q);
  const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
  return listings.sort((a, b) => {
    const dateA = a.completedAt?.toDate?.()?.getTime() || 0;
    const dateB = b.completedAt?.toDate?.()?.getTime() || 0;
    return dateB - dateA;
  });
};

export const addListing = async (listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'interestedCount' | 'ownerName' | 'ownerInitials' | 'ownerAvatarColor'>): Promise<Listing> => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('No user logged in');
  
  const listingsRef = collection(db, 'listings');
  const newListing = {
    ...listing,
    ownerName: currentUser.name,
    ownerInitials: currentUser.initials,
    ownerAvatarColor: currentUser.avatarColor,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    views: 0,
    interestedCount: 0,
  };
  
  const docRef = await addDoc(listingsRef, newListing);
  
  // Dodaj aktywność
  await addActivity({
    listingId: docRef.id,
    listingTitle: listing.title,
    userId: currentUser.id,
    userName: currentUser.name,
    userInitials: currentUser.initials,
    userAvatarColor: currentUser.avatarColor,
    action: listing.listingType === 'offer' ? 'created_offer' : 'created_request',
  });
  
  return { id: docRef.id, ...newListing } as Listing;
};

export const updateListing = async (id: string, updates: Partial<Listing>): Promise<void> => {
  const docRef = doc(db, 'listings', id);
  await updateDoc(docRef, { ...updates, updatedAt: Timestamp.now() });
};

export const deleteListing = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'listings', id));
};

export const incrementListingViews = async (id: string): Promise<void> => {
  const docRef = doc(db, 'listings', id);
  await updateDoc(docRef, { views: increment(1) });
};

// ==================== APPLICATIONS ====================

export const addApplication = async (listingId: string, message: string): Promise<Application | null> => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('No user logged in');
  
  const listing = await getListingById(listingId);
  if (!listing) return null;
  if (listing.ownerId === currentUser.id) return null;
  if (listing.status !== 'active') return null;
  
  const applicationsRef = collection(db, 'listings', listingId, 'applications');
  const existingQuery = query(applicationsRef, where('userId', '==', currentUser.id));
  const existingSnap = await getDocs(existingQuery);
  
  if (!existingSnap.empty) return null;
  
  const application: Omit<Application, 'id'> = {
    userId: currentUser.id,
    userName: currentUser.name,
    userInitials: currentUser.initials,
    userAvatarColor: currentUser.avatarColor,
    message,
    status: 'pending',
    appliedAt: Timestamp.now(),
  };
  
  const docRef = await addDoc(applicationsRef, application);
  
  // Dodaj powiadomienie dla właściciela
  await addNotification(listing.ownerId, {
    type: 'new_application',
    title: 'Nowe zgłoszenie!',
    message: `${currentUser.name} zgłosił/a się do Twojego ogłoszenia "${listing.title}"`,
    listingId,
    fromUserId: currentUser.id,
  });
  
  return { id: docRef.id, ...application };
};

export const getApplicationsForListing = async (listingId: string): Promise<Application[]> => {
  const applicationsRef = collection(db, 'listings', listingId, 'applications');
  const snapshot = await getDocs(applicationsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
};

export const getApplicationStatus = async (listingId: string, userId: string): Promise<'pending' | 'accepted' | 'rejected' | null> => {
  const applicationsRef = collection(db, 'listings', listingId, 'applications');
  const q = query(applicationsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  const data = snapshot.docs[0].data();
  return data.status as 'pending' | 'accepted' | 'rejected';
};

export const updateApplicationStatus = async (
  listingId: string, 
  userId: string, 
  status: 'pending' | 'accepted' | 'rejected'
): Promise<boolean> => {
  const applicationsRef = collection(db, 'listings', listingId, 'applications');
  const q = query(applicationsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return false;
  
  const docRef = snapshot.docs[0].ref;
  await updateDoc(docRef, { status });
  return true;
};

// ==================== COMPLETE LISTING ====================

// ⭐️ DODANE: Globalny callback dla powiadomień o punktach
let pointsNotificationCallback: ((points: number, action: string, target?: string) => void) | null = null;

export const setPointsNotificationCallback = (callback: ((points: number, action: string, target?: string) => void) | null) => {
  pointsNotificationCallback = callback;
};

export const completeListing = async (listingId: string, completedWithUserId: string): Promise<boolean> => {
  const listing = await getListingById(listingId);
  if (!listing) return false;
  if (listing.status !== 'active') return false;
  if (listing.ownerId === completedWithUserId) return false;
  
  // Sprawdź czy użytkownik ma zaakceptowane zgłoszenie
  const applications = await getApplicationsForListing(listingId);
  const application = applications.find(a => a.userId === completedWithUserId);
  if (!application || application.status !== 'accepted') return false;
  
  const points = listing.suggestedPoints || 50;
  
  // Przyznaj punkty
  if (listing.listingType === 'request') {
    // To jest prośba o pomoc - osoba, która pomogła (completedWithUserId) dostaje punkty
    await updateUserImpactScore(completedWithUserId, points, 'completed_help', listing.title);
    await updateUserImpactScore(listing.ownerId, Math.floor(points / 2), 'received_help', listing.title);
    
    // ⭐️ WYŚLIJ POWIADOMIENIE dla osoby, która pomogła
    if (pointsNotificationCallback) {
      pointsNotificationCallback(points, 'completed_help', listing.title);
    }
  } else {
    // To jest oferta - właściciel oferty dostaje bonus, a osoba korzystająca dostaje punkty
    await updateUserImpactScore(completedWithUserId, points, 'received_help', listing.title);
    await updateUserImpactScore(listing.ownerId, Math.floor(points * 1.5), 'offer_shared', listing.title);
    
    // ⭐️ WYŚLIJ POWIADOMIENIE dla właściciela oferty (bonus za udostępnienie)
    if (pointsNotificationCallback) {
      pointsNotificationCallback(Math.floor(points * 1.5), 'offer_shared', listing.title);
    }
  }
  
  // Aktualizuj listing
  await updateListing(listingId, {
    status: 'completed',
    completedWithUserId,
    completedAt: Timestamp.now(),
  });
  
  // Zwiększ licznik wymian dla obu użytkowników
  const userRef = doc(db, 'users', listing.ownerId);
  await updateDoc(userRef, { exchangesCount: increment(1) });
  const helperRef = doc(db, 'users', completedWithUserId);
  await updateDoc(helperRef, { exchangesCount: increment(1) });
  
  // Dodaj aktywność o zakończeniu
  await addActivity({
    listingId,
    listingTitle: listing.title,
    userId: listing.ownerId,
    userName: listing.ownerName,
    userInitials: listing.ownerInitials,
    userAvatarColor: listing.ownerAvatarColor,
    action: 'completed_exchange',
  });
  
  // Dodaj powiadomienie dla pomagającego
  await addNotification(completedWithUserId, {
    type: 'listing_completed',
    title: 'Ogłoszenie zakończone!',
    message: `Ogłoszenie "${listing.title}" zostało zakończone. Otrzymałeś/aś ${points} punktów!`,
    listingId,
  });
  
  return true;
};

// ==================== ACTIVITY FEED ====================

export const addActivity = async (activity: Omit<ActivityItem, 'id' | 'timestamp' | 'likes'>): Promise<void> => {
  const activitiesRef = collection(db, 'activities');
  const currentUser = getCurrentUser();
  await addDoc(activitiesRef, {
    ...activity,
    userAvatarUrl: currentUser?.avatarUrl || null,
    timestamp: Timestamp.now(),
    likes: 0,
  });
};

export const getActivityFeed = async (limitCount: number = 10): Promise<ActivityItem[]> => {
  const activitiesRef = collection(db, 'activities');
  const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityItem));
};

// Nasłuchiwanie na żywo aktywności
export const subscribeToActivityFeed = (
  callback: (activities: ActivityItem[]) => void,
  limitCount: number = 10
) => {
  const activitiesRef = collection(db, 'activities');
  const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(limitCount));
  
  return onSnapshot(q, (snapshot) => {
    const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityItem));
    callback(activities);
  });
};

// ==================== NOTIFICATIONS ====================

export const addNotification = async (userId: string, notification: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>): Promise<void> => {
  const notificationsRef = collection(db, 'users', userId, 'notifications');
  await addDoc(notificationsRef, {
    ...notification,
    userId,
    read: false,
    createdAt: Timestamp.now(),
  });
};

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const notificationsRef = collection(db, 'users', userId, 'notifications');
  const q = query(notificationsRef, orderBy('createdAt', 'desc'), limit(50));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
};

export const markNotificationAsRead = async (userId: string, notificationId: string): Promise<void> => {
  const notificationRef = doc(db, 'users', userId, 'notifications', notificationId);
  await updateDoc(notificationRef, { read: true });
};

export const subscribeToNotifications = (userId: string, callback: (notifications: Notification[]) => void) => {
  const notificationsRef = collection(db, 'users', userId, 'notifications');
  const q = query(notificationsRef, orderBy('createdAt', 'desc'), limit(50));
  
  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
    callback(notifications);
  });
};

// ==================== CONVERSATIONS & MESSAGES ====================


export const getOrCreateConversation = async (listingId: string, otherUserId: string): Promise<Conversation> => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('No user logged in');
  
  const listing = await getListingById(listingId);
  if (!listing) throw new Error('Listing not found');
  
  const otherUser = await getUserById(otherUserId);
  if (!otherUser) throw new Error('Other user not found');
  
  // Lepsze sprawdzenie czy konwersacja już istnieje
  const conversationsRef = collection(db, 'conversations');
  const q = query(
    conversationsRef,
    where('participants', 'array-contains', currentUser.id),
    where('listingId', '==', listingId)
  );
  const snapshot = await getDocs(q);
  
  // Sprawdź czy istnieje konwersacja z tym samym listingId i tymi samymi uczestnikami
  for (const doc of snapshot.docs) {
    const conv = doc.data() as Conversation;
    if (conv.participants.includes(currentUser.id) && conv.participants.includes(otherUserId)) {
      return { ...conv, id: doc.id };
    }
  }
  
  // Utwórz nową konwersację
  const newConversation: Omit<Conversation, 'id'> = {
    participants: [currentUser.id, otherUserId],
    participantsData: [
      {
        id: currentUser.id,
        name: currentUser.name,
        initials: currentUser.initials,
        avatarColor: currentUser.avatarColor,
      },
      {
        id: otherUserId,
        name: otherUser.name,
        initials: otherUser.initials,
        avatarColor: otherUser.avatarColor,
      },
    ],
    listingId,
    listingTitle: listing.title,
    lastMessage: '',
    lastMessageTime: Timestamp.now(),
    unreadFor: [otherUserId],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  
  const docRef = await addDoc(conversationsRef, newConversation);
  return { id: docRef.id, ...newConversation };
};

export const getUserConversations = async (userId: string): Promise<Conversation[]> => {
  const conversationsRef = collection(db, 'conversations');
  // TYMCZASOWO bez orderBy
  const q = query(conversationsRef, where('participants', 'array-contains', userId));
  const snapshot = await getDocs(q);
  const conversations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Conversation));
  return conversations.sort((a, b) => {
    const dateA = a.updatedAt?.toDate?.()?.getTime() || 0;
    const dateB = b.updatedAt?.toDate?.()?.getTime() || 0;
    return dateB - dateA;
  });
};

export const subscribeToUserConversations = (userId: string, callback: (conversations: Conversation[]) => void) => {
  const conversationsRef = collection(db, 'conversations');
  const q = query(conversationsRef, where('participants', 'array-contains', userId));
  
  return onSnapshot(q, (snapshot) => {
    const conversations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Conversation));
    const sorted = conversations.sort((a, b) => {
      const dateA = a.updatedAt?.toDate?.()?.getTime() || 0;
      const dateB = b.updatedAt?.toDate?.()?.getTime() || 0;
      return dateB - dateA;
    });
    callback(sorted);
  });
};

export const addMessage = async (conversationId: string, text: string): Promise<ChatMessage> => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('No user logged in');
  
  const conversationRef = doc(db, 'conversations', conversationId);
  const conversationSnap = await getDoc(conversationRef);
  if (!conversationSnap.exists()) throw new Error('Conversation not found');
  
  const conversation = conversationSnap.data() as Conversation;
  const otherUserId = conversation.participants.find(p => p !== currentUser.id)!;
  
  const message: Omit<ChatMessage, 'id'> = {
    conversationId,
    fromUserId: currentUser.id,
    fromUserName: currentUser.name,
    fromUserInitials: currentUser.initials,
    fromUserAvatarColor: currentUser.avatarColor,
    text,
    timestamp: Timestamp.now(),
    read: false,
  };
  
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const docRef = await addDoc(messagesRef, message);
  
  // Aktualizuj ostatnią wiadomość w konwersacji
  await updateDoc(conversationRef, {
    lastMessage: text,
    lastMessageTime: Timestamp.now(),
    unreadFor: arrayUnion(otherUserId),
    updatedAt: Timestamp.now(),
  });
  
  // Dodaj powiadomienie dla odbiorcy
  await addNotification(otherUserId, {
    type: 'new_message',
    title: 'Nowa wiadomość',
    message: `${currentUser.name} napisał/a: ${text.slice(0, 50)}${text.length > 50 ? '...' : ''}`,
    conversationId,
  });
  
  return { id: docRef.id, ...message } as ChatMessage;
};

export const getMessagesForConversation = async (conversationId: string): Promise<ChatMessage[]> => {
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
};

export const subscribeToMessages = (conversationId: string, callback: (messages: ChatMessage[]) => void) => {
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
    callback(messages);
  });
};

export const markMessagesAsRead = async (conversationId: string, userId: string): Promise<void> => {
  const conversationRef = doc(db, 'conversations', conversationId);
  await updateDoc(conversationRef, {
    unreadFor: arrayRemove(userId),
  });
};

export const deleteConversation = async (conversationId: string): Promise<void> => {
  // Usuń wszystkie wiadomości w konwersacji
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const messagesSnap = await getDocs(messagesRef);
  const batch = writeBatch(db);
  messagesSnap.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  batch.delete(doc(db, 'conversations', conversationId));
  await batch.commit();
};

// ==================== COMMUNITY STATS ====================

export interface CommunityStats {
  communityHealth: number;
  totalExchanges: number;
  impactScore: number;
}

export const getCommunityStats = async (): Promise<CommunityStats> => {
  const users = await getAllUsers();
  const listings = await getListings();
  const completedListings = listings.filter(l => l.status === 'completed');
  
  const totalImpactScore = users.reduce((sum, u) => sum + (u.impactScore || 0), 0);
  const communityHealth = users.length > 0 ? Math.min(100, Math.floor(totalImpactScore / users.length)) : 0;
  
  return {
    communityHealth,
    totalExchanges: completedListings.length,
    impactScore: totalImpactScore,
  };
};

// ==================== PROFILE ====================


// Upload zdjęcia profilowego do Firebase Storage
export const uploadProfileImage = async (userId: string, file: File): Promise<string> => {
  const storageRef = ref(storage, `profile-images/${userId}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

// Aktualizacja profilu użytkownika
export const updateUserProfile = async (
  userId: string, 
  updates: Partial<Pick<User, 'name' | 'bio' | 'neighborhood' | 'avatarUrl'>>
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
  
  // Jeśli zmieniono name, zaktualizuj też inicjały
  if (updates.name) {
    const newInitials = updates.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    await updateDoc(userRef, { initials: newInitials });
  }
  
  // Aktualizuj currentUser w pamięci
  const updatedUser = await getUserById(userId);
  if (updatedUser && currentFirebaseUser?.id === userId) {
    notifyAuthChange(updatedUser);
  }
};

// Zmiana hasła użytkownika
export const changeUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('No user logged in');
  
  if (newPassword.length < 6) {
    throw new Error('Hasło musi mieć co najmniej 6 znaków');
  }
  
  // Re-autoryzacja z obecnym hasłem
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  
  // Zmiana hasła
  await updatePassword(user, newPassword);
};

// Usunięcie konta użytkownika
export const deleteUserAccount = async (password: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('No user logged in');
  
  // Re-autoryzacja przed usunięciem - POPRAWNA WERSJA
  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);
  
  // Reszta kodu bez zmian...
  const userId = user.uid;
  
  // 1. Usuń wszystkie ogłoszenia użytkownika
  const listings = await getListingsByUser(userId);
  for (const listing of listings) {
    await deleteDoc(doc(db, 'listings', listing.id));
  }
  
  // 2. Usuń wszystkie konwersacje użytkownika
  const conversations = await getUserConversations(userId);
  for (const conv of conversations) {
    await deleteConversation(conv.id);
  }
  
  // 3. Usuń wszystkie aktywności użytkownika
  const activitiesRef = collection(db, 'activities');
  const q = query(activitiesRef, where('userId', '==', userId));
  const activitiesSnap = await getDocs(q);
  for (const doc of activitiesSnap.docs) {
    await deleteDoc(doc.ref);
  }
  
  // 4. Usuń dokument użytkownika
  await deleteDoc(doc(db, 'users', userId));
  
  // 5. Usuń zdjęcie profilowe ze storage jeśli istnieje
  try {
    const profileImageRef = ref(storage, `profile-images/${userId}`);
    await deleteObject(profileImageRef);
  } catch (error) {
    // Ignoruj jeśli nie istnieje
  }
  
  // 6. Usuń konto z Auth
  await user.delete();
  
  notifyAuthChange(null);
};

// ==================== CATEGORIES (statyczne) ====================

export const favorCategories = [
  { id: 'cat-1', label: 'Naprawa', iconName: 'Wrench', gradientFrom: '#7dd3c0', gradientTo: '#a8d5ba' },
  { id: 'cat-2', label: 'Transport', iconName: 'Car', gradientFrom: '#89cff0', gradientTo: '#7dd3c0' },
  { id: 'cat-3', label: 'Edukacja', iconName: 'BookOpen', gradientFrom: '#a8d5ba', gradientTo: '#c2e7d9' },
  { id: 'cat-4', label: 'Dom i Ogród', iconName: 'Home', gradientFrom: '#7dd3c0', gradientTo: '#89cff0' },
  { id: 'cat-5', label: 'Opieka', iconName: 'Heart', gradientFrom: '#b8d8e8', gradientTo: '#89cff0' },
  { id: 'cat-6', label: 'Gotowanie', iconName: 'Utensils', gradientFrom: '#a8d5ba', gradientTo: '#7dd3c0' },
  { id: 'cat-7', label: 'Narzędzia', iconName: 'Wrench', gradientFrom: '#7dd3c0', gradientTo: '#a8d5ba' },
  { id: 'cat-8', label: 'Ogród', iconName: 'Home', gradientFrom: '#a8d5ba', gradientTo: '#c2e7d9' },
];

// Helper do timeAgo
export const timeAgo = (timestamp: Timestamp | Date | string): string => {
  let date: Date;
  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else {
    date = timestamp;
  }
  
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} sek. temu`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min temu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} godz. temu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} dni temu`;
  return date.toLocaleDateString('pl-PL');
};