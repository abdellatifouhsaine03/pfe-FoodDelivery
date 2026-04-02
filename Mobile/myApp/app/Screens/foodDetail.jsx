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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useCart } from '../cart-Context/cart';
import { useNavigation } from 'expo-router';

const FoodDetailsScreen = () => {
  
    const navigate = useNavigation();


   const { addToCart , cartItems } = useCart()

  const [quantity, setQuantity] = useState(2);

  const handleMinus = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handlePlus = () => {
    setQuantity(quantity + 1);
  };

  const cartPrice = (7.99 * quantity).toFixed(2);

  const AddToCart = () => {
    addToCart({
      id: 1,
        name: 'Beef Burger',
        image: 'https://pngimg.com/d/kfc_food_PNG2.png',
        price: 7.99,

  })
  navigate.navigate("Cart")

};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Card Section */}
        <View style={styles.imageCard}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.buttonIcon}>←</Text>
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity style={styles.favoriteButton}>
            <Text style={styles.buttonIcon}>♡</Text>
          </TouchableOpacity>

          {/* Burger Image */}
          <Image
            source={{
              uri: 'https://pngimg.com/d/kfc_food_PNG2.png',
            }}
            style={styles.burgerImage}
          />

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleMinus}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.quantityText}>{quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handlePlus}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Food Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.foodName}>Beef Burger</Text>
            <Text style={styles.price}>$7.99</Text>
          </View>
          <Text style={styles.subtitle}>Beef Patty and special sauce</Text>
        </View>

        {/* Info Badges Section */}
        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>🔥</Text>
            <Text style={styles.badgeText}>Free</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>⏱</Text>
            <Text style={styles.badgeText}>10-15 min</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>⭐</Text>
            <Text style={styles.badgeText}>4.8</Text>
          </View>
        </View>

        {/* Ingredients Section */}
        <View style={styles.ingredientsSection}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientsRow}>
            <View style={styles.ingredientCard}>
              <Text style={styles.ingredientIcon}>🍖</Text>
              <Text style={styles.ingredientName}>Beef</Text>
            </View>

            <View style={styles.ingredientCard}>
              <Text style={styles.ingredientIcon}>🥬</Text>
              <Text style={styles.ingredientName}>Lettuce</Text>
            </View>

            <View style={styles.ingredientCard}>
              <Text style={styles.ingredientIcon}>🫒</Text>
              <Text style={styles.ingredientName}>Olive Oil</Text>
            </View>

            <View style={styles.ingredientCard}>
              <Text style={styles.ingredientIcon}>🥚</Text>
              <Text style={styles.ingredientName}>Egg</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            This special beef burger uses special quality beef with sliced tomatoes, fresh lettuce, and chef's secret sauce.
          </Text>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={AddToCart}>
          <Text style={styles.addToCartText}>
            Add to Cart (${cartPrice})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF5F0',
    marginTop: 40,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageCard: {
    backgroundColor: '#2D2D3D',
    
    marginTop: 16,
    borderRadius: 24,
    height: 340,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D2D3D',
  },
  burgerImage: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },
  quantityContainer: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2D3D',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2D3D',
    minWidth: 20,
    textAlign: 'center',
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  foodName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D2D3D',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B35',
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
    marginTop: 4,
  },
  badgesRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  badge: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeIcon: {
    fontSize: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D2D3D',
  },
  ingredientsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D2D3D',
    marginBottom: 12,
  },
  ingredientsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ingredientCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  ingredientIcon: {
    fontSize: 28,
  },
  ingredientName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D2D3D',
    textAlign: 'center',
  },
  aboutSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  aboutText: {
    fontSize: 14,
    color: '#777777',
    lineHeight: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FEF5F0',
  },
  addToCartButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default FoodDetailsScreen;
