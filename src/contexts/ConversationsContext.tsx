import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { currentUser, conversations as initialConversations, chatMessages as initialChatMessages } from '../data/appData';
import type { Conversation, ChatMessage } from '../data/appData';

interface ConversationsContextType {
  conversations: Conversation[];
  messages: ChatMessage[];
  addConversation: (listingId: string, otherUserId: string) => Conversation;
  addMessage: (conversationId: string, text: string) => void;
  getMessagesForConversation: (conversationId: string) => ChatMessage[];
  getUserConversations: (userId: string) => Conversation[];
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export function ConversationsProvider({ children }: { children: React.ReactNode }) {
  const STORAGE_KEY = 'localLoop_conversations';
  const MESSAGES_KEY = 'localLoop_messages';
  
  // Referencja do blokowania jednoczesnych zapisów
  const isAddingConversation = useRef<Set<string>>(new Set());

  const loadInitialData = () => {
    const storedConversations = localStorage.getItem(STORAGE_KEY);
    const storedMessages = localStorage.getItem(MESSAGES_KEY);
    return {
      conversations: storedConversations ? JSON.parse(storedConversations) : initialConversations,
      messages: storedMessages ? JSON.parse(storedMessages) : initialChatMessages,
    };
  };

  const [conversations, setConversations] = useState<Conversation[]>(() => loadInitialData().conversations);
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadInitialData().messages);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  // Generowanie unikalnego ID z większą precyzją
  const generateUniqueId = useCallback(() => {
    return `conv-${Date.now()}-${performance.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }, []);

  const addConversation = useCallback((listingId: string, otherUserId: string): Conversation => {
    const key = `${listingId}-${otherUserId}`;
    
    // Zapobieganie równoczesnym tworzeniom tej samej rozmowy
    if (isAddingConversation.current.has(key)) {
      // Jeśli już tworzymy, znajdź istniejącą
      const existing = conversations.find(
        c => c.listingId === listingId && c.participants.includes(otherUserId)
      );
      if (existing) return existing;
    }
    
    isAddingConversation.current.add(key);
    
    // Sprawdź czy już istnieje
    const existing = conversations.find(
      c => c.listingId === listingId && c.participants.includes(otherUserId)
    );
    
    if (existing) {
      isAddingConversation.current.delete(key);
      return existing;
    }

    const newConv: Conversation = {
      id: generateUniqueId(),
      participants: [currentUser.id, otherUserId],
      listingId,
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadFor: [otherUserId],
    };

    setConversations(prev => {
      // Ponownie sprawdź czy nie powstało w międzyczasie
      const stillExisting = prev.find(
        c => c.listingId === listingId && c.participants.includes(otherUserId)
      );
      if (stillExisting) {
        isAddingConversation.current.delete(key);
        return prev;
      }
      isAddingConversation.current.delete(key);
      return [...prev, newConv];
    });

    return newConv;
  }, [conversations, generateUniqueId]);

  const addMessage = useCallback((conversationId: string, text: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      conversationId,
      fromUserId: currentUser.id,
      text,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    setMessages(prev => [...prev, newMessage]);
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: text,
              lastMessageTime: new Date().toISOString(),
              unreadFor: c.unreadFor.filter(id => id !== currentUser.id),
            }
          : c
      )
    );
  }, [conversations]);

  const getMessagesForConversation = useCallback((conversationId: string) => {
    return messages.filter(m => m.conversationId === conversationId);
  }, [messages]);

  const getUserConversations = useCallback((userId: string) => {
    return conversations.filter(c => c.participants.includes(userId));
  }, [conversations]);

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        messages,
        addConversation,
        addMessage,
        getMessagesForConversation,
        getUserConversations,
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