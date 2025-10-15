import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ArrowLeft, Mail, Github, Heart } from 'lucide-react';
import { Logo3D } from '@/components/Logo3D';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FooterBar } from '@/components/FooterBar';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="glass-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">About</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          {/* 3D Logo */}
          <div className="h-64 rounded-2xl overflow-hidden glass-card">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <spotLight position={[0, 10, 0]} angle={0.3} intensity={0.5} />
              <Logo3D />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
              <Environment preset="sunset" />
            </Canvas>
          </div>

          {/* App Info */}
          <div className="glass-card rounded-2xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold text-gradient">GoldLeaf Market</h2>
              <p className="text-lg text-muted-foreground">
                A Premium Peer-to-Peer Trading Experience
              </p>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <section>
                <h3 className="font-semibold text-foreground text-lg mb-2">The Concept</h3>
                <p>
                  GoldLeaf Market is a modern, luxurious marketplace where anyone can list or browse 
                  premium products like cigarettes, beer, wine, and more. Built with cutting-edge 
                  web technologies, it offers a smooth, mobile-first experience with beautiful 
                  3D animations and transitions.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground text-lg mb-2">Privacy First</h3>
                <p>
                  No login required, no servers, no tracking. Everything runs locally in your browser 
                  using localStorage. Your chat messages, product listings, and preferences stay on 
                  your device - giving you complete privacy and control.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground text-lg mb-2">How It Works</h3>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Browse products by category with smooth infinite scrolling</li>
                  <li>View detailed product information and provider details</li>
                  <li>Chat temporarily with providers (messages stored locally)</li>
                  <li>Upload your own products with images and descriptions</li>
                  <li>Install as a PWA for a native app-like experience</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-foreground text-lg mb-2">Technology</h3>
                <p>
                  Built with React, Tailwind CSS, Framer Motion for smooth animations, and 
                  Three.js for stunning 3D visuals. Designed to feel like a premium mobile 
                  app while running entirely in your browser.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground text-lg mb-2">Temporary Chat Limitation</h3>
                <p>
                  Since there's no backend server, chat messages are stored only on your device. 
                  They'll persist while you use the app but won't sync across devices or be visible 
                  to other users. It's perfect for quick coordination!
                </p>
              </section>
            </div>
          </div>

          {/* Contact Section */}
          <div className="glass-card rounded-2xl p-8">
            <h3 className="font-semibold text-lg mb-4 text-center">Get in Touch</h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                className="hover:gold-glow transition-all"
                onClick={() => window.location.href = 'mailto:hello@goldleaf.market'}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Developer
              </Button>
              <Button
                variant="outline"
                className="hover:gold-glow transition-all"
                onClick={() => window.open('https://github.com', '_blank')}
              >
                <Github className="h-4 w-4 mr-2" />
                View on GitHub
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              Made with <Heart className="h-4 w-4 text-primary fill-primary" /> for premium trading
            </p>
          </div>
        </motion.div>
      </div>
      <FooterBar />
    </div>
  );
}
