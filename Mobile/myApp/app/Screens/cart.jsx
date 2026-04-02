'use client';

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import { useCart } from '../cart-Context/cart';

const { width } = Dimensions.get('window');

const Cart = ({ onBackPress, onCheckout }) => {



    const { cartItems} = useCart();


  const [cartItems2, setCartItems] = useState([
    {
      id: 1,
      name: 'Carbonara pasta',
      subtitle: '+ Packaging fee\n+ Parmesan cheese',
      price: 12.5,
      quantity: 1,
      image: '/images/screenshot-202026-01-29-20112949.png',
    },
    {
      id: 2,
      name: 'Juice 250ml',
      subtitle: 'Orange',
      price: 3.1,
      quantity: 1,
      image: '/images/screenshot-202026-01-29-20112949.png',
    },
  ]);

  const recommendations = [
    {
      id: 1,
      name: 'Tiramisu',
      price: 6.8,
      image: '/images/screenshot-202026-01-29-20112949.png',
    },
    {
      id: 2,
      name: 'Creme brulee',
      price: 5.2,
      image: '/images/screenshot-202026-01-29-20112949.png',
    },
    {
      id: 3,
      name: 'Cappuccino',
      price: 5.5,
      image: '/images/screenshot-202026-01-29-20112949.png',
    },
  ];

  const updateQuantity = (itemId, change) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
    );
  };

  const addRecommendation = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      updateQuantity(item.id, 1);
    } else {
      setCartItems([
        ...cartItems,
        { ...item, id: Date.now(), quantity: 1 },
      ]);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your order</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order items</Text>

          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
              />

              <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
              </View>

              <View style={styles.itemRight}>
                <Text style={styles.itemPrice}>€{item.price.toFixed(2)}</Text>

                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, -1)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, 1)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>€{totalPrice.toFixed(2)}</Text>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recommendationsScroll}
          >
            {recommendations.map((item) => (
              <View key={item.id} style={styles.recommendationCard}>
                <View style={styles.recommendationImageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.recommendationImage}
                  />
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addRecommendation(item)}
                  >
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.recommendationPrice}>€{item.price.toFixed(2)}</Text>
                <Text style={styles.recommendationName}>{item.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={onCheckout}
        >
          <Text style={styles.checkoutButtonText}>
            Go to checkout
          </Text>
          <Text style={styles.checkoutPrice}>€{totalPrice.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE8DC',
    borderRadius: 6,
    paddingHorizontal: 4,
    gap: 4,
  },
  quantityButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: '#FF6B35',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginHorizontal: 4,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
  },
  recommendationsScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  recommendationCard: {
    width: (width - 64) / 3,
    marginRight: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  recommendationImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F5E6DB',
  },
  recommendationImage: {
    width: '100%',
    height: '100%',
  },
  addButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recommendationPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B35',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  recommendationName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  checkoutButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  checkoutPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Cart;
