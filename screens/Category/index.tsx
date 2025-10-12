import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '../../store/hooks';
import { productsApi } from '../../services/api';
import { Product } from '../../types';
import { ProductCard } from '@/components/ui/ProductCard';

export default function CategoryScreen() {
  const { isOnline } = useAppSelector((state) => state.app);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['laptops']);

  const { data: productsData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['products', 'categories', selectedCategories],
    queryFn: async () => {
      if (selectedCategories.length === 0) {
        return { products: [] };
      }
      
      // Fetch products for all selected categories
      const productsPromises = selectedCategories.map(category => 
        productsApi.getProductsByCategory(category)
      );
      
      const productsResults = await Promise.all(productsPromises);
      
      // Combine all products into a single array
      const allProducts = productsResults.flatMap(result => result.products);
      
      return { products: allProducts };
    },
    enabled: selectedCategories.length > 0 // Only fetch when categories are selected
  });

  // 修改这里：使用正确的 API 调用来获取类别
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories,
  });

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  }, []);

  useEffect(() => {
    if (selectedCategories.length > 0) {
      refetch();
    }
  }, [selectedCategories, refetch]);

  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategories.includes(item) && styles.selectedCategoryItem
      ]}
      onPress={() => toggleCategory(item)}
    >
      <View style={[
        styles.checkbox,
        selectedCategories.includes(item) && styles.checkedCheckbox
      ]}>
        {selectedCategories.includes(item) && <View style={styles.checkedInner} />}
      </View>
      <Text
        style={[
          styles.categoryText,
          selectedCategories.includes(item) && styles.selectedCategoryText
        ]}
      >
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </Text>
    </TouchableOpacity>
  );

/**
 * Render a single product item
 * @param {{ item: Product }} props
 * @returns {JSX.Element} A ProductCard component
 */
  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
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
        <View>
          <Text style={styles.title}>Categories</Text>
          <Text style={styles.subtitle}>
            {productsData?.products.length || 0} products in {selectedCategories.length > 0 ? selectedCategories.join(', ') : 'no categories selected'}
          </Text>
        </View>
        {!isOnline && (
          <View style={styles.offlineBadge}>
            <Text style={styles.offlineText}>Offline</Text>
          </View>
        )}
      </View>

      <View style={styles.categoriesContainer}>
        {/* 修改这里：使用 categoriesData 来渲染分类列表 */}
        <FlatList
          data={categoriesData || []}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <FlatList
        data={productsData?.products}
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
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
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
  categoriesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  selectedCategoryItem: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkedCheckbox: {
    borderColor: '#3b82f6',
    backgroundColor: '#3b82f6',
  },
  checkedInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  categoryText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#1d4ed8',
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