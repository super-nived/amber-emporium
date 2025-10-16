import { Home, PlusCircle, User, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { getUserChats } from '@/hooks/useChat';

export const FooterBar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [totalUnread, setTotalUnread] = useState(0);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (!user) return;

    const unsubscribe = getUserChats(user.uid, (chats) => {
      // Count total unread messages across all chats
      let count = 0;
      chats.forEach((chat) => {
        // This is a simplified count - in production you'd want to properly count unread messages
        if (chat.lastMessage) count++;
      });
      setTotalUnread(count);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t safe-bottom">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          <Link to="/">
            <Button
              variant="ghost"
              size="icon"
              className={`hover:bg-primary/10 ${isActive('/') ? 'text-primary' : ''}`}
              aria-label="Home"
            >
              <Home className="h-6 w-6" />
            </Button>
          </Link>

          <Link to="/chats">
            <Button
              variant="ghost"
              size="icon"
              className={`hover:bg-primary/10 relative ${isActive('/chats') ? 'text-primary' : ''}`}
              aria-label="Messages"
            >
              <MessageCircle className="h-6 w-6" />
              {totalUnread > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary">
                  {totalUnread}
                </Badge>
              )}
            </Button>
          </Link>

          <Link to="/add-product">
            <Button
              size="icon"
              className="h-14 w-14 rounded-full gold-gradient shadow-lg hover:scale-110 transition-transform"
              aria-label="Add Product"
            >
              <PlusCircle className="h-7 w-7" />
            </Button>
          </Link>

          <Link to="/profile">
            <Button
              variant="ghost"
              size="icon"
              className={`hover:bg-primary/10 ${isActive('/profile') ? 'text-primary' : ''}`}
              aria-label="Profile"
            >
              <User className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
