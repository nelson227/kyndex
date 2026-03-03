'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserStorage, setUserStorage } from '@/lib/user-storage';
import { Send, Search, Plus, X } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  read: boolean;
}

interface Conversation {
  id: string;
  userId: string;
  otherUserId: string;
  otherUserName: string;
  messages: Message[];
  unreadCount: number;
}

interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Charger les conversations de l'utilisateur
  useEffect(() => {
    if (!user?.id) return;

    const savedConversations = getUserStorage<Conversation[]>('conversations', user.id);
    if (savedConversations && Array.isArray(savedConversations)) {
      setConversations(savedConversations);
    }

    // Charger la liste de tous les utilisateurs
    const allUsersData = JSON.parse(localStorage.getItem('kyndex_users') || '[]') as User[];
    const other = allUsersData.filter(u => u.id?.toString() !== user.id);
    setAllUsers(other);
  }, [user?.id]);

  // Auto-scroll vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  // Sauvegarder les conversations
  const saveConversations = (updated: Conversation[]) => {
    if (!user?.id) return;
    setConversations(updated);
    setUserStorage('conversations', updated, user.id);

    // Émettre un événement pour notifier le layout des changements
    window.dispatchEvent(new CustomEvent('unreadCountsUpdated'));
  };

  // Envoyer un message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation || !user?.id) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Vous',
      content: messageInput,
      timestamp: Date.now(),
      read: false,
    };

    // Mettre à jour la conversation
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage],
    };

    const updatedConversations = conversations.map(conv =>
      conv.id === selectedConversation.id ? updatedConversation : conv
    );

    saveConversations(updatedConversations);
    setSelectedConversation(updatedConversation);
    setMessageInput('');

    // Sauvegarder aussi pour l'autre utilisateur
    const otherUserConversations = getUserStorage<Conversation[]>('conversations', updatedConversation.otherUserId) || [];
    const otherConvIndex = otherUserConversations.findIndex(c => c.otherUserId === user.id);
    
    if (otherConvIndex >= 0) {
      otherUserConversations[otherConvIndex] = {
        ...otherUserConversations[otherConvIndex],
        messages: [...otherUserConversations[otherConvIndex].messages, newMessage],
        unreadCount: (otherUserConversations[otherConvIndex].unreadCount || 0) + 1,
      };
    } else {
      const newConvForOther: Conversation = {
        id: `conv_${selectedConversation.otherUserId}_${user.id}`,
        userId: selectedConversation.otherUserId,
        otherUserId: user.id,
        otherUserName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        messages: [newMessage],
        unreadCount: 1,
      };
      otherUserConversations.push(newConvForOther);
    }

    setUserStorage('conversations', otherUserConversations, updatedConversation.otherUserId);
  };

  // Démarrer une nouvelle conversation
  const handleStartConversation = (otherUser: User) => {
    if (!user?.id) return;

    const existing = conversations.find(c => c.otherUserId === otherUser.id?.toString());
    if (existing) {
      setSelectedConversation(existing);
      setShowNewChat(false);
      return;
    }

    const newConv: Conversation = {
      id: `conv_${user.id}_${otherUser.id}`,
      userId: user.id,
      otherUserId: otherUser.id?.toString() || '',
      otherUserName: `${otherUser.firstname} ${otherUser.lastname}`,
      messages: [],
      unreadCount: 0,
    };

    const updated = [...conversations, newConv];
    saveConversations(updated);
    setSelectedConversation(newConv);
    setShowNewChat(false);
  };

  // Marquer une conversation comme lue
  const handleSelectConversation = (conversation: Conversation) => {
    // Réinitialiser le compteur de messages non lus
    const updatedConversations = conversations.map(conv =>
      conv.id === conversation.id 
        ? { ...conv, unreadCount: 0 }
        : conv
    );

    // Sauvegarder les changements
    saveConversations(updatedConversations);

    // Sélectionner la conversation avec le compteur réinitialisé
    const updatedConversation = {
      ...conversation,
      unreadCount: 0,
    };
    setSelectedConversation(updatedConversation);
  };

  // Filtrer les utilisateurs
  const filteredUsers = allUsers.filter(u =>
    `${u.firstname} ${u.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtrer les conversations
  const filteredConversations = conversations.filter(c =>
    c.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Veuillez vous connecter</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-gray-400 text-sm mb-1">Messagerie</p>
        <h1 className="text-4xl font-bold text-white">Messages</h1>
        <p className="text-gray-400 mt-2">Communiquez avec vos clients et prestataires</p>
      </div>

      {/* Main Chat Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Left: Conversations List */}
        <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Conversations</h2>
              <button
                onClick={() => setShowNewChat(!showNewChat)}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
              >
                {showNewChat ? <X size={20} className="text-red-400" /> : <Plus size={20} className="text-cyan-400" />}
              </button>
            </div>

            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-cyan-500 transition"
              />
            </div>
          </div>

          {/* New Chat Selection */}
          {showNewChat && (
            <div className="border-b border-gray-800 max-h-64 overflow-y-auto">
              <div className="p-4 space-y-2">
                <p className="text-xs text-gray-400 px-2">Sélectionner un utilisateur</p>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => handleStartConversation(u)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-800 rounded-lg transition border border-transparent hover:border-gray-700"
                    >
                      <p className="font-semibold text-white text-sm">{u.firstname} {u.lastname}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center py-4">Aucun utilisateur trouvé</p>
                )}
              </div>
            </div>
          )}

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-800 transition ${
                    selectedConversation?.id === conv.id
                      ? 'bg-cyan-500/20 border-l-4 border-l-cyan-500'
                      : 'hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{conv.otherUserName}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].content : 'Pas de messages'}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="flex-shrink-0 ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6">
                <p className="text-sm">Aucune conversation</p>
                <p className="text-xs mt-2">Cliquez sur + pour en démarrer une</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chat Window */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-800">
                <h3 className="text-lg font-bold text-white">{selectedConversation.otherUserName}</h3>
                <p className="text-xs text-cyan-400 mt-1">En ligne</p>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/20">
                {selectedConversation.messages.length > 0 ? (
                  selectedConversation.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-3 rounded-2xl ${
                          msg.senderId === user.id
                            ? 'bg-cyan-500 text-white rounded-br-none'
                            : 'bg-gray-800 text-gray-100 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                        <p className={`text-xs mt-1 opacity-70`}>
                          {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p className="text-sm">Aucun message. Lancez la conversation!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-gray-800">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Écrivez votre message..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 transition"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-3 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-lg transition flex items-center justify-center"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-lg">Sélectionnez une conversation</p>
              <p className="text-sm mt-2">ou créez-en une nouvelle</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
