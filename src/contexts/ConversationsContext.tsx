import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  getCurrentUser, 
  getUserConversations as fetchUserConversations,
  subscribeToUserConversations,
  getMessagesForConversation as fetchMessages,
  subscribeToMessages,
  addMessage as addMessageToFirebase,
  getOrCreateConversation,
  markMessagesAsRead,
  deleteConversation as deleteConversationFromFirebase,
  type Conversation, 
  type ChatMessage 
} from '../data/firebaseData';

interface ConversationsContextType {
  conversations: Conversation[];
  addConversation: (listingId: string, otherUserId: string) => Promise<Conversation | null>;
  addMessage: (conversationId: string, text: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  getMessagesForConversation: (conversationId: string) => ChatMessage[];
  getUserConversations: (userId: string) => Conversation[];
  subscribeToConversationMessages: (conversationId: string, callback: (messages: ChatMessage[]) => void) => () => void;
  markAsRead: (conversationId: string) => Promise<void>;
  loading: boolean;
  getExistingConversation: (listingId: string, otherUserId: string) => Conversation | undefined;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export function ConversationsProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messagesCache, setMessagesCache] = useState<Map<string, ChatMessage[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const pendingCreations = useRef<Map<string, Promise<Conversation>>>(new Map());

  // Subskrypcja konwersacji dla bieżącego użytkownika
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const unsub = subscribeToUserConversations(currentUser.id, (newConversations) => {
      setConversations(newConversations);
      setLoading(false);
    });

    return () => {
      if (unsub) unsub();
    };
  }, []);

  // Sprawdź czy konwersacja już istnieje
  const getExistingConversation = useCallback((listingId: string, otherUserId: string): Conversation | undefined => {
    const currentUser = getCurrentUser();
    if (!currentUser) return undefined;
    
    return conversations.find(c => 
      c.listingId === listingId && 
      c.participants.includes(currentUser.id) && 
      c.participants.includes(otherUserId)
    );
  }, [conversations]);

  const addConversation = useCallback(async (listingId: string, otherUserId: string): Promise<Conversation | null> => {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    
    // Sprawdź czy już istnieje
    const existing = getExistingConversation(listingId, otherUserId);
    if (existing) {
      console.log('Conversation already exists:', existing.id);
      return existing;
    }
    
    // Klucz dla pending creation
    const key = `${listingId}-${otherUserId}`;
    
    // Jeśli już trwa tworzenie tej konwersacji, zwróć istniejącą promise
    if (pendingCreations.current.has(key)) {
      return pendingCreations.current.get(key)!;
    }
    
    // Utwórz nową konwersację
    const promise = getOrCreateConversation(listingId, otherUserId);
    pendingCreations.current.set(key, promise);
    
    try {
      const newConv = await promise;
      return newConv;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      return null;
    } finally {
      pendingCreations.current.delete(key);
    }
  }, [getExistingConversation]);

  const addMessage = useCallback(async (conversationId: string, text: string) => {
    await addMessageToFirebase(conversationId, text);
  }, []);

  const deleteConversation = useCallback(async (conversationId: string) => {
    await deleteConversationFromFirebase(conversationId);
  }, []);

  const getMessagesForConversation = useCallback((conversationId: string): ChatMessage[] => {
    return messagesCache.get(conversationId) || [];
  }, [messagesCache]);

  const getUserConversations = useCallback((userId: string): Conversation[] => {
    return conversations.filter(c => c.participants.includes(userId));
  }, [conversations]);

  const subscribeToConversationMessages = useCallback((
    conversationId: string, 
    callback: (messages: ChatMessage[]) => void
  ) => {
    return subscribeToMessages(conversationId, (messages) => {
      setMessagesCache(prev => new Map(prev).set(conversationId, messages));
      callback(messages);
    });
  }, []);

  const markAsRead = useCallback(async (conversationId: string) => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      await markMessagesAsRead(conversationId, currentUser.id);
    }
  }, []);

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        addConversation,
        addMessage,
        deleteConversation,
        getMessagesForConversation,
        getUserConversations,
        subscribeToConversationMessages,
        markAsRead,
        loading,
        getExistingConversation,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const context = useContext(ConversationsContext);
  if (!context) throw new Error('useConversations must be used within ConversationsProvider');
  return context;
}