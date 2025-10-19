import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addProduct } from '@/lib/localStorage';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function AddProduct() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: 'Cigarette' as 'Cigarette' | 'Beer' | 'Wine' | 'Other',
    providerName: '',
    providerLocation: '',
    googleMapsUrl: '',
    description: '',
    imageUrl: '/placeholder.svg',
  });

  const [imagePreview, setImagePreview] = useState<string>('/placeholder.svg');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    addProduct({
      name: formData.name,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      category: formData.category,
      providerName: formData.providerName || 'Anonymous Seller',
      providerId: user?.uid,
      providerLocation: formData.providerLocation || 'Location not specified',
      googleMapsUrl: formData.googleMapsUrl,
      description: formData.description,
      imageUrl: formData.imageUrl,
    });

    // Success animation
    toast.success('Product published successfully! 🎉', {
      duration: 3000,
    });

    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="glass-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Add New Product</h1>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* Image Upload */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <Label>Product Image</Label>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted/30">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                <label className="cursor-pointer">
                  <div className="glass-card px-4 py-2 flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload Image</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Marlboro Gold Premium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, quantity: e.target.value }))
                  }
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cigarette">Cigarette</SelectItem>
                  <SelectItem value="Beer">Beer</SelectItem>
                  <SelectItem value="Wine">Wine</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Describe your product..."
                rows={4}
              />
            </div>
          </div>

          {/* Provider Details */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg">Provider Information</h3>

            <div className="space-y-2">
              <Label htmlFor="providerName">Your Name/Business</Label>
              <Input
                id="providerName"
                value={formData.providerName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, providerName: e.target.value }))
                }
                placeholder="e.g., Premium Tobacco Co."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="providerLocation">Location</Label>
              <Input
                id="providerLocation"
                value={formData.providerLocation}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    providerLocation: e.target.value,
                  }))
                }
                placeholder="e.g., Downtown District"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleMapsUrl">Google Maps URL (optional)</Label>
              <Input
                id="googleMapsUrl"
                type="url"
                value={formData.googleMapsUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, googleMapsUrl: e.target.value }))
                }
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full gold-gradient text-lg h-14 hover:scale-105 transition-transform"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Publish Product
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
