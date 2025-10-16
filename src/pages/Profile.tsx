import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Users, LogOut, Check, Sparkles } from 'lucide-react';
import { MessageCircle, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FooterBar } from '@/components/FooterBar';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
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
  const [shared, setShared] = useState(false);
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
          
          // Generate invite code if user doesn't have one
          let userInviteCode = userData.userInviteCode;
          if (!userInviteCode) {
            const { generateInviteCode } = await import('@/lib/inviteCodes');
            userInviteCode = generateInviteCode();
            
            // Update user document with new invite code
            await setDoc(doc(db, 'users', username), {
              ...userData,
              userInviteCode
            }, { merge: true });
            
            // Create invite code document
            await setDoc(doc(db, 'inviteCodes', userInviteCode), {
              code: userInviteCode,
              usedCount: 0,
              maxUses: 2,
              createdAt: new Date(),
              createdBy: user.uid,
              isMaster: false
            });
            
            toast.success('Invite code generated!');
          }
          
          setProfile({
            username,
            email: userData.email,
            createdAt: userData.createdAt?.toDate(),
            inviteCode: userData.inviteCode,
            userInviteCode
          });

          // Get users who signed up with this user's invite code
          if (userInviteCode) {
            const inviteesQuery = query(
              collection(db, 'users'),
              where('inviteCode', '==', userInviteCode)
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

  const shareViaWhatsApp = () => {
    if (!profile?.userInviteCode) return;
    const inviteUrl = `${window.location.origin}/signup?invite=${profile.userInviteCode}`;
    const message = `Join me on Amber Emporium using my invite code: ${profile.userInviteCode}\n\n${inviteUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const shareViaInstagram = () => {
    if (!profile?.userInviteCode) return;
    const inviteUrl = `${window.location.origin}/signup?invite=${profile.userInviteCode}`;
    navigator.clipboard.writeText(`Join me on Amber Emporium! Use code: ${profile.userInviteCode}\n${inviteUrl}`);
    toast.success('Invite message copied! Paste it in Instagram.');
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

  const isInviteFull = invitees.length >= 2;

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="glass-card border-b sticky top-0 z-10 backdrop-blur-lg bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:scale-105 transition-transform">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Profile</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive transition-colors">
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
          <Card className="p-6 space-y-4 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-center pb-4 border-b border-primary/10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/50 mx-auto mb-4 flex items-center justify-center text-4xl font-bold shadow-lg ring-4 ring-primary/20"
              >
                {profile?.username.charAt(0).toUpperCase()}
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{profile?.username}</h2>
              <p className="text-sm text-muted-foreground mt-1">{profile?.email}</p>
            </div>

            <div className="space-y-3">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10"
              >
                <span className="text-sm font-medium text-muted-foreground">Member Since</span>
                <span className="font-semibold">
                  {profile?.createdAt?.toLocaleDateString()}
                </span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10"
              >
                <span className="text-sm font-medium text-muted-foreground">Signed Up With</span>
                <span className="font-semibold font-mono text-primary">{profile?.inviteCode}</span>
              </motion.div>
            </div>
          </Card>

          {/* Invite Code Card */}
          {profile?.userInviteCode && (
            <Card className="p-6 space-y-4 border-primary/30 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-card to-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Your Invite Code</h3>
              </div>
              
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border-2 border-primary/30 shadow-inner">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-bold font-mono tracking-wider text-primary">
                    {profile.userInviteCode}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyInviteCode}
                    className="hover:bg-primary/20 hover:scale-110 transition-all"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5 text-primary" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Share this code to invite up to 2 users
                </p>
                
                {/* Share Buttons Section */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-center text-muted-foreground">Share via</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={shareViaWhatsApp}
                      disabled={isInviteFull}
                      className={`w-full ${isInviteFull ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} transition-all bg-[#25D366] hover:bg-[#20BA5A]`}
                      variant={isInviteFull ? "outline" : "default"}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                    
                    <Button
                      onClick={shareViaInstagram}
                      disabled={isInviteFull}
                      className={`w-full ${isInviteFull ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} transition-all bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90`}
                      variant={isInviteFull ? "outline" : "default"}
                    >
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram
                    </Button>
                  </div>
                  
                  {isInviteFull && (
                    <p className="text-xs text-center text-destructive font-medium mt-2">
                      All invite slots used (2/2)
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Invited Users ({invitees.length}/2)
                  </h4>
                  <span className={`text-sm px-3 py-1.5 rounded-full font-semibold ${
                    isInviteFull 
                      ? 'bg-destructive/10 text-destructive' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {isInviteFull ? 'Full' : `${2 - invitees.length} remaining`}
                  </span>
                </div>

                {invitees.length > 0 ? (
                  <div className="space-y-3">
                    {invitees.map((invitee, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/5 to-background border border-primary/10 hover:border-primary/20 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center font-bold text-lg shadow-md">
                            {invitee.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold">{invitee.username}</p>
                            <p className="text-xs text-muted-foreground">
                              Joined {invitee.createdAt?.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4 rounded-xl bg-muted/30 border border-dashed border-primary/20">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Users className="h-16 w-16 mx-auto mb-3 text-primary/40" />
                    </motion.div>
                    <p className="font-medium text-muted-foreground">No users invited yet</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">Share your code to invite friends!</p>
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
