import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowLeft, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getUserChats, getUnreadCount, Chat } from '@/hooks/useChat';
import { listenToPresence } from '@/hooks/usePresence';
import { RealtimeChatBox } from '@/components/RealtimeChatBox';
import { FooterBar } from '@/components/FooterBar';

export default function Chats() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<{ chatId: string; providerId: string; name: string } | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [onlineStatus, setOnlineStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) return;

    const unsubscribe = getUserChats(user.uid, async (fetchedChats) => {
      setChats(fetchedChats);

      // Get unread counts for each chat
      const counts: Record<string, number> = {};
      for (const chat of fetchedChats) {
        const count = await getUnreadCount(chat.id, user.uid);
        counts[chat.id] = count;
      }
      setUnreadCounts(counts);

      // Listen to online status for each participant
      fetchedChats.forEach((chat) => {
        const otherUserId = chat.participants.find((id) => id !== user.uid);
        if (otherUserId) {
          listenToPresence(otherUserId, (status) => {
            setOnlineStatus((prev) => ({
              ...prev,
              [otherUserId]: status.state === 'online',
            }));
          });
        }
      });
    });

    return () => unsubscribe();
  }, [user]);

  const handleChatClick = (chat: Chat) => {
    const otherUserId = chat.participants.find((id) => id !== user?.uid);
    if (!otherUserId) return;

    const chatName = user?.uid === chat.participants[0] ? chat.providerName : chat.userName;
    
    setSelectedChat({
      chatId: chat.id,
      providerId: otherUserId,
      name: chatName || 'User',
    });
  };

  return (
    <>
      <div className="min-h-screen pb-24">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Messages</h1>
          </div>

          {/* Chat List */}
          <div className="space-y-3">
            {chats.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-8 text-center"
              >
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
                <p className="text-muted-foreground">
                  Start chatting with providers from product pages
                </p>
              </motion.div>
            ) : (
              chats.map((chat, index) => {
                const otherUserId = chat.participants.find((id) => id !== user?.uid);
                const isOnline = otherUserId ? onlineStatus[otherUserId] : false;
                const chatName = user?.uid === chat.participants[0] ? chat.providerName : chat.userName;
                const unreadCount = unreadCounts[chat.id] || 0;

                return (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleChatClick(chat)}
                    className="glass-card rounded-2xl p-4 cursor-pointer hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <MessageCircle className="h-6 w-6 text-primary" />
                        </div>
                        {isOnline && (
                          <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500 ring-2 ring-background" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-semibold truncate">{chatName}</h3>
                          {chat.lastUpdated && (
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {chat.lastUpdated.toDate().toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage || 'No messages yet'}
                        </p>
                      </div>

                      {unreadCount > 0 && (
                        <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                          {unreadCount}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <FooterBar />

      {/* Chat Modal */}
      {selectedChat && (
        <RealtimeChatBox
          chatId={selectedChat.chatId}
          providerId={selectedChat.providerId}
          providerName={selectedChat.name}
          onClose={() => setSelectedChat(null)}
        />
      )}
    </>
  );
}
