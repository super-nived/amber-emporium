import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Logo3D } from '@/components/Logo3D';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { setTermsAgreed } from '@/lib/localStorage';

export default function TermsAndConditions() {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleAgree = () => {
    if (agreed) {
      setTermsAgreed(true);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          {/* 3D Logo */}
          <div className="h-48 mb-6">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <spotLight position={[0, 10, 0]} angle={0.3} intensity={0.5} />
              <Logo3D />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
              <Environment preset="sunset" />
            </Canvas>
          </div>

          {/* App Title */}
          <h1 className="text-4xl font-bold text-center mb-2 text-gradient">
            GoldLeaf Market
          </h1>
          <p className="text-center text-muted-foreground mb-6">
            A Premium Trading Experience
          </p>

          {/* Terms Content */}
          <div className="bg-muted/30 rounded-lg p-6 max-h-64 overflow-y-auto mb-6 space-y-4">
            <h2 className="text-xl font-semibold mb-3">Terms & Conditions</h2>
            
            <div className="space-y-3 text-sm">
              <p>
                Welcome to GoldLeaf Market. By using this application, you agree to the following terms and conditions:
              </p>
              
              <div>
                <h3 className="font-semibold mb-1">1. Platform Purpose</h3>
                <p>
                  GoldLeaf Market is a peer-to-peer marketplace platform that enables users to list and browse products 
                  including tobacco, alcoholic beverages, and other items.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">2. Age Requirements</h3>
                <p>
                  You must be of legal age in your jurisdiction to purchase tobacco and alcohol products. 
                  By using this platform, you confirm that you meet all age requirements.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">3. User Responsibility</h3>
                <p>
                  Users are solely responsible for compliance with all local laws and regulations regarding 
                  the sale and purchase of listed items. The platform does not facilitate transactions directly.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">4. Data & Privacy</h3>
                <p>
                  This application uses local storage only. No user data is transmitted to external servers. 
                  Chat messages and product listings are stored locally on your device.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">5. No Authentication</h3>
                <p>
                  This platform does not require user accounts or authentication. All interactions are 
                  temporary and stored locally.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">6. Limitation of Liability</h3>
                <p>
                  GoldLeaf Market is provided "as is" without warranties. The platform is not responsible 
                  for transactions between users or the quality of listed products.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">7. Prohibited Activities</h3>
                <p>
                  Users may not list illegal items, engage in fraudulent activity, or misrepresent products. 
                  The platform reserves the right to remove content at its discretion.
                </p>
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-center space-x-3 mb-6">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              I have read and agree to the Terms & Conditions
            </label>
          </div>

          {/* Enter Button */}
          <Button
            onClick={handleAgree}
            disabled={!agreed}
            className="w-full gold-gradient text-lg h-12 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enter GoldLeaf Market
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
