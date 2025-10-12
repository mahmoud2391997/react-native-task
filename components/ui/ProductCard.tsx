import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  showDelete?: boolean;
  onDelete?: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showDelete = false,
  onDelete,
}) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.thumbnail }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <View style={styles.footer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.category}</Text>
          </View>
          {showDelete && onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(product.id)}
              activeOpacity={0.7}
            >
              <Trash2 size={18} color="#dc2626" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#f1f5f9',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
  },
});
