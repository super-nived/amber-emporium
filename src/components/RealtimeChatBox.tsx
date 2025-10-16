import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Circle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useChat, sendMessage, markMessagesAsSeen } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { listenToPresence } from '@/hooks/usePresence';
import { toast } from 'sonner';

interface RealtimeChatBoxProps {
  chatId: string;
  providerId: string;
  providerName: string;
  onClose: () => void;
}

export const RealtimeChatBox = ({
  chatId,
  providerId,
  providerName,
  onClose,
}: RealtimeChatBoxProps) => {
  const { user } = useAuth();
  const { messages, loading } = useChat(chatId);
  const [inputValue, setInputValue] = useState('');
  const [providerStatus, setProviderStatus] = useState<{ state: string; last_changed: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!chatId || !user) return;
    
    // Mark messages as seen when opening chat
    markMessagesAsSeen(chatId, user.uid);
  }, [chatId, user]);

  useEffect(() => {
    // Listen to provider's online status
    const unsubscribe = listenToPresence(providerId, (status) => {
      setProviderStatus(status);
    });

    return () => unsubscribe();
  }, [providerId]);

  const handleSend = async () => {
    if (!inputValue.trim() || !user) return;

    try {
      await sendMessage(chatId, user.uid, providerId, inputValue);
      setInputValue('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getLastSeenText = () => {
    if (!providerStatus) return '';
    if (providerStatus.state === 'online') return 'Active now';
    
    const lastSeen = new Date(providerStatus.last_changed);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'Active just now';
    if (diffMinutes < 60) return `Active ${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Active ${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `Active ${diffDays}d ago`;
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex flex-col"
    >
      {/* Header */}
      <div className="glass-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-semibold">{providerName}</h3>
            <div className="flex items-center gap-2">
              {providerStatus?.state === 'online' && (
                <Circle className="h-2 w-2 fill-green-500 text-green-500" />
              )}
              <p className="text-xs text-muted-foreground">{getLastSeenText()}</p>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Start a conversation!</p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className={`flex ${message.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.senderId === user?.uid
                      ? 'gold-gradient text-white'
                      : 'glass-card'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs opacity-70">
                      {message.timestamp?.toDate().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {message.senderId === user?.uid && (
                      <span className="text-xs opacity-70">
                        {message.seen ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass-card border-t p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="gold-gradient"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
