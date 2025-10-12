import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '../../store/hooks';
import { productsApi } from '../../services/api';
import { ProductCard } from '../../components/ui/ProductCard';
import { Product } from '../../types';

export default function AllProductsScreen() {
  const queryClient = useQueryClient();
  const { isSuperAdmin } = useAppSelector((state) => state.auth);
  const { isOnline } = useAppSelector((state) => state.app);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const {
    data: productsData,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAllProducts,
  });

  const handleDelete = async (productId: number) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await productsApi.deleteProduct(productId);
              if (response.isDeleted) {
                setDeletedIds((prev) => [...prev, productId]);
                Alert.alert('Success', 'Product deleted successfully');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product');
            }
          },
        },
      ]
    );
  };

  const filteredProducts = productsData?.products.filter(
    (product) => !deletedIds.includes(product.id)
  );

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      showDelete={isSuperAdmin}
      onDelete={handleDelete}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {isLoading ? 'Loading products...' : 'No products available'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Products</Text>
        {!isOnline && (
          <View style={styles.offlineBadge}>
            <Text style={styles.offlineText}>Offline</Text>
          </View>
        )}
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#2563eb"
          />
        }
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  offlineBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  offlineText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
  },
});
