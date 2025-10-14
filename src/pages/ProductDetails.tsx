import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, MessageCircle, Package, ExternalLink } from 'lucide-react';
import { getProducts, Product } from '@/lib/localStorage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChatBox } from '@/components/ChatBox';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const products = getProducts();
    const found = products.find((p) => p.id === id);
    setProduct(found || null);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const categoryColors = {
    Cigarette: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
    Beer: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
    Wine: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
    Other: 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30',
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Header with Image */}
        <div className="relative h-96 bg-muted/30">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 glass-card hover:bg-background/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 -mt-20 relative z-10 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 space-y-6"
          >
            {/* Title & Category */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <Badge className={categoryColors[product.category]}>
                  {product.category}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-5 w-5" />
              <span>{product.quantity} units available</span>
            </div>

            {/* Provider Info */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Provider</p>
                  <p className="font-semibold text-lg">{product.providerName}</p>
                </div>
                {product.googleMapsUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(product.googleMapsUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Map
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{product.providerLocation}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1 gold-gradient text-lg h-12 hover:scale-105 transition-transform"
                onClick={() => setChatOpen(true)}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat with Provider
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Chat Modal */}
      <AnimatePresence>
        {chatOpen && (
          <ChatBox
            productId={product.id}
            providerName={product.providerName}
            onClose={() => setChatOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
