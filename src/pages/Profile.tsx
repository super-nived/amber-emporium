import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Users, LogOut, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FooterBar } from '@/components/FooterBar';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

interface UserProfile {
  username: string;
  email: string;
  createdAt: Date;
  inviteCode: string;
  userInviteCode?: string;
}

interface Invitee {
  username: string;
  createdAt: Date;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        // Get username from email
        const username = user.email?.split('@')[0] || '';
        
        // Get user profile
        const userDoc = await getDoc(doc(db, 'users', username));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfile({
            username,
            email: userData.email,
            createdAt: userData.createdAt?.toDate(),
            inviteCode: userData.inviteCode,
            userInviteCode: userData.userInviteCode
          });

          // Get users who signed up with this user's invite code
          if (userData.userInviteCode) {
            const inviteesQuery = query(
              collection(db, 'users'),
              where('inviteCode', '==', userData.userInviteCode)
            );
            const inviteesSnapshot = await getDocs(inviteesQuery);
            const inviteesData = inviteesSnapshot.docs.map(doc => ({
              username: doc.data().username,
              createdAt: doc.data().createdAt?.toDate()
            }));
            setInvitees(inviteesData);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const copyInviteCode = () => {
    if (profile?.userInviteCode) {
      navigator.clipboard.writeText(profile.userInviteCode);
      setCopied(true);
      toast.success('Invite code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="glass-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* User Info Card */}
          <Card className="p-6 space-y-4">
            <div className="text-center pb-4 border-b">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/50 mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                {profile?.username.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold">{profile?.username}</h2>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="font-medium">
                  {profile?.createdAt?.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Signed Up With</span>
                <span className="font-medium font-mono">{profile?.inviteCode}</span>
              </div>
            </div>
          </Card>

          {/* Invite Code Card */}
          {profile?.userInviteCode && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Your Invite Code</h3>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold font-mono tracking-wider">
                    {profile.userInviteCode}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyInviteCode}
                    className="hover:bg-primary/10"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Share this code to invite up to 2 users
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Invited Users ({invitees.length}/2)</h4>
                  <span className="text-sm px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {2 - invitees.length} remaining
                  </span>
                </div>

                {invitees.length > 0 ? (
                  <div className="space-y-2">
                    {invitees.map((invitee, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                            {invitee.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{invitee.username}</p>
                            <p className="text-xs text-muted-foreground">
                              Joined {invitee.createdAt?.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No users invited yet</p>
                    <p className="text-sm">Share your code to invite friends!</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </motion.div>
      </div>

      <FooterBar />
    </div>
  );
}
