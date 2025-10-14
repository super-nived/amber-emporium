import { motion } from 'framer-motion';
import { MapPin, Package } from 'lucide-react';
import { Product } from '@/lib/localStorage';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const categoryColors = {
    Cigarette: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
    Beer: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
    Wine: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
    Other: 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-card rounded-xl overflow-hidden cursor-pointer hover:gold-glow transition-all duration-300"
    >
      {/* Product Image */}
      <div className="relative h-48 bg-muted/30 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge className={categoryColors[product.category]}>
            {product.category}
          </Badge>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{product.providerLocation}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>{product.quantity} available</span>
          </div>
          <div className="text-xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          by {product.providerName}
        </div>
      </div>
    </motion.div>
  );
};
