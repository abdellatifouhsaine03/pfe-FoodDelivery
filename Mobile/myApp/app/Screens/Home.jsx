"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  StatusBar,
  ImageBackground,
  TextInput,
} from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // professional, lightweight icons

import Categories from "../component/categoies";
import { useNavigation } from "expo-router";
import Nav from "../component/Nav";

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("delivery");

  const categories = [
    { id: 1, name: "Omelette", icon: "🍳" },
    { id: 2, name: "Waffle", icon: "🧇" },
    { id: 3, name: "Garlic Bread", icon: "🥖" },
    { id: 4, name: "Salad", icon: "🥗" },
    { id: 5, name: "Croissant", icon: "🥐" },
    { id: 6, name: "Yogurt Bowl", icon: "🍲" },
    { id: 7, name: "Pizza", icon: "🍕" },
    { id: 8, name: "Chicken", icon: "🍗" },
  ];

  const navigate = useNavigation();



  const restaurants = [
    {
      id: 1,
      name: "Big Bowl",
      rating: 4.7,
      reviews: 19,
      time: "19 mins",
      image: "https://via.placeholder.com/200x140?text=Big+Bowl",
    },
    {
      id: 2,
      name: "McDonald's",
      rating: 4.8,
      reviews: 18,
      time: "18 mins",
      image: "https://via.placeholder.com/200x140?text=McDonalds",
    },
    {
      id: 3,
      name: "Behrouz Biryani",
      rating: 4.3,
      reviews: 25,
      time: "25 mins",
      image: "https://via.placeholder.com/200x140?text=Behrouz",
    },
    {
      id: 4,
      name: "Rokas",
      rating: 4.4,
      reviews: 23,
      time: "23 km",
      image: "https://via.placeholder.com/200x140?text=Rokas",
    },
    {
      id: 5,
      name: "Julie's",
      rating: 4.6,
      reviews: 12,
      time: "12 mins",
      image: "https://via.placeholder.com/200x140?text=Julies",
    },
    {
      id: 6,
      name: "Gurukirpa Veg Cheap",
      rating: 4.5,
      reviews: 21,
      time: "21 km",
      image: "https://via.placeholder.com/200x140?text=Gurukirpa",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <ImageBackground
            source={{
              uri: "https://cdn.dribbble.com/userupload/38938526/file/original-1e0eb25709a880af5627b8decb29b138.png?resize=752x&vertical=center",
            }}
            style={styles.imageBackground}
            imageStyle={styles.bgImage}
          >
          <Nav/>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Feather
                name="search"
                size={20}
                color="red"
                style={styles.icon}
              />
              <TextInput style={styles.input} placeholder="Search..." />
            </View>

            {/* Promo Banner */}
            <View style={styles.promoBanner}>
              <View style={styles.promoContent}>
                <Text style={styles.promoTitle}>Your Cravings,</Text>
                <Text style={styles.promoTitle}>Delivered Fresh</Text>
                <TouchableOpacity style={styles.orderBtn}>
                  <Text style={styles.orderBtnText}>Order Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Flash Sale Card */}
        <View style={styles.BestPromotion}>
          <View style={styles.BestPheader}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>
              Best Promotion %
            </Text>
            <Text style={styles.BestPOthers}>Others</Text>
          </View>
          <View style={styles.BestPCards}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.BestPCardsItem}>
                <Image
                  source={{
                    uri: "https://media.istockphoto.com/id/495204032/photo/fresh-tasty-burger.jpg?s=612x612&w=0&k=20&c=k6X_gSHlo-WdKsqTnfBjoEbjdhrlz6RNhUs23ivpIxk=",
                  }}
                  style={{ width: "100%", height: "70%", borderRadius: 8 }}
                />
                <View style={{ marginHorizontal: 10 }}>
                  <Text
                    style={{ fontWeight: "bold", marginTop: 5, fontSize: 16 }}
                  >
                    Cheese Burger
                  </Text>
                  <Text style={{ color: "#ff6b6b", fontSize: 12 }}>
                    Tacos Hamid
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name="truck-delivery-outline"
                        size={20}
                        color="#ff6b6b"
                      />
                      <Text> $3,00</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name="sale"
                        size={20}
                        color="#ff6b6b"
                      />
                      <Text
                        style={{
                          textDecorationLine: "line-through",
                          color: "brown",
                        }}
                      >
                        {" "}
                        $3,00
                      </Text>
                      <Text> $3,00</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.BestPCardsItem}>
                <Image
                  source={{
                    uri: "https://media.istockphoto.com/id/495204032/photo/fresh-tasty-burger.jpg?s=612x612&w=0&k=20&c=k6X_gSHlo-WdKsqTnfBjoEbjdhrlz6RNhUs23ivpIxk=",
                  }}
                  style={{ width: "100%", height: "70%", borderRadius: 8 }}
                />
                <View style={{ marginHorizontal: 10 }}>
                  <Text
                    style={{ fontWeight: "bold", marginTop: 5, fontSize: 16 }}
                  >
                    Cheese Burger
                  </Text>
                  <Text style={{ color: "#ff6b6b", fontSize: 12 }}>
                    Tacos Hamid
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name="truck-delivery-outline"
                        size={20}
                        color="#ff6b6b"
                      />
                      <Text> $3,00</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name="sale"
                        size={20}
                        color="#ff6b6b"
                      />
                      <Text
                        style={{
                          textDecorationLine: "line-through",
                          color: "brown",
                        }}
                      >
                        {" "}
                        $3,00
                      </Text>
                      <Text> $3,00</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.BestPCardsItem}>
                <Image
                  source={{
                    uri: "https://media.istockphoto.com/id/495204032/photo/fresh-tasty-burger.jpg?s=612x612&w=0&k=20&c=k6X_gSHlo-WdKsqTnfBjoEbjdhrlz6RNhUs23ivpIxk=",
                  }}
                  style={{ width: "100%", height: "70%", borderRadius: 8 }}
                />
                <View style={{ marginHorizontal: 10 }}>
                  <Text
                    style={{ fontWeight: "bold", marginTop: 5, fontSize: 16 }}
                  >
                    Cheese Burger
                  </Text>
                  <Text style={{ color: "#ff6b6b", fontSize: 12 }}>
                    Tacos Hamid
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name="truck-delivery-outline"
                        size={20}
                        color="#ff6b6b"
                      />
                      <Text> $3,00</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name="sale"
                        size={20}
                        color="#ff6b6b"
                      />
                      <Text
                        style={{
                          textDecorationLine: "line-through",
                          color: "brown",
                        }}
                      >
                        {" "}
                        $3,00
                      </Text>
                      <Text> $3,00</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.BestPCardsItem}>
                <Image
                  source={{
                    uri: "https://media.istockphoto.com/id/495204032/photo/fresh-tasty-burger.jpg?s=612x612&w=0&k=20&c=k6X_gSHlo-WdKsqTnfBjoEbjdhrlz6RNhUs23ivpIxk=",
                  }}
                  style={{ width: "100%", height: "70%", borderRadius: 8 }}
                />
                <View style={{ marginHorizontal: 10 }}>
                  <Text
                    style={{ fontWeight: "bold", marginTop: 5, fontSize: 16 }}
                  >
                    Cheese Burger
                  </Text>
                  <Text style={{ color: "#ff6b6b", fontSize: 12 }}>
                    Tacos Hamid
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name="truck-delivery-outline"
                        size={20}
                        color="#ff6b6b"
                      />
                      <Text> $3,00</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name="sale"
                        size={20}
                        color="#ff6b6b"
                      />
                      <Text
                        style={{
                          textDecorationLine: "line-through",
                          color: "brown",
                        }}
                      >
                        {" "}
                        $3,00
                      </Text>
                      <Text> $3,00</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>

        {/* What's on your mind */}
        <View style={styles.Popular}>
          <View style={styles.BestPheader}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>
              Popular Items 👏
            </Text>
            <Text style={styles.BestPOthers}>See All</Text>
          </View>
          <View style={styles.PopularCards}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.PCardsItem}>
                <Image
                  source={{
                    uri: "https://media.istockphoto.com/id/495204032/photo/fresh-tasty-burger.jpg?s=612x612&w=0&k=20&c=k6X_gSHlo-WdKsqTnfBjoEbjdhrlz6RNhUs23ivpIxk=",
                  }}
                  style={{ width: "100%", height: "70%", borderRadius: 8 }}
                />
                <View style={{ marginHorizontal: 10 }}>
                  <Text
                    style={{ fontWeight: "bold", marginTop: 5, fontSize: 16 }}
                  >
                    Cheese Burger
                  </Text>
                  <Text style={{ color: "#ff6b6b", fontSize: 12 }}>
                    Tacos Hamid
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name="star"
                        size={20}
                        color="#c0890aff"
                      />
                      <Text>4,1</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={{ fontSize: 15, fontVariant: "bold" }}>
                        $30.00
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.PCardsItem}>
                <Image
                  source={{
                    uri: "data:image/jpeg;base64,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",
                  }}
                  style={{ width: "100%", height: "70%", borderRadius: 8 }}
                />
                <View style={{ marginHorizontal: 10 }}>
                  <Text
                    style={{ fontWeight: "bold", marginTop: 5, fontSize: 16 }}
                  >
                    Pizza Ton
                  </Text>
                  <Text style={{ color: "#ff6b6b", fontSize: 12 }}>
                    Snack elmadani
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name="star"
                        size={20}
                        color="#c0890aff"
                      />
                      <Text>4,1</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={{ fontSize: 15, fontVariant: "bold" }}>
                        $30.00
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.PCardsItem}>
                <Image
                  source={{
                    uri: "https://media.istockphoto.com/id/495204032/photo/fresh-tasty-burger.jpg?s=612x612&w=0&k=20&c=k6X_gSHlo-WdKsqTnfBjoEbjdhrlz6RNhUs23ivpIxk=",
                  }}
                  style={{ width: "100%", height: "70%", borderRadius: 8 }}
                />
                <View style={{ marginHorizontal: 10 }}>
                  <Text
                    style={{ fontWeight: "bold", marginTop: 5, fontSize: 16 }}
                  >
                    Cheese Burger
                  </Text>
                  <Text style={{ color: "#ff6b6b", fontSize: 12 }}>
                    Tacos Hamid
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name="star"
                        size={20}
                        color="#c0890aff"
                      />
                      <Text>4,1</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={{ fontSize: 15, fontVariant: "bold" }}>
                        $30.00
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.PCardsItem}>
                <Image
                  source={{
                    uri: "https://media.istockphoto.com/id/495204032/photo/fresh-tasty-burger.jpg?s=612x612&w=0&k=20&c=k6X_gSHlo-WdKsqTnfBjoEbjdhrlz6RNhUs23ivpIxk=",
                  }}
                  style={{ width: "100%", height: "70%", borderRadius: 8 }}
                />
                <View style={{ marginHorizontal: 10 }}>
                  <Text
                    style={{ fontWeight: "bold", marginTop: 5, fontSize: 16 }}
                  >
                    Cheese Burger
                  </Text>
                  <Text style={{ color: "#ff6b6b", fontSize: 12 }}>
                    Tacos Hamid
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name="star"
                        size={20}
                        color="#c0890aff"
                      />
                      <Text>4,1</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={{ fontSize: 15, fontVariant: "bold" }}>
                        $30.00
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.PCardsItem}>
                <Image
                  source={{
                    uri: "https://media.istockphoto.com/id/495204032/photo/fresh-tasty-burger.jpg?s=612x612&w=0&k=20&c=k6X_gSHlo-WdKsqTnfBjoEbjdhrlz6RNhUs23ivpIxk=",
                  }}
                  style={{ width: "100%", height: "70%", borderRadius: 8 }}
                />
                <View style={{ marginHorizontal: 10 }}>
                  <Text
                    style={{ fontWeight: "bold", marginTop: 5, fontSize: 16 }}
                  >
                    Cheese Burger
                  </Text>
                  <Text style={{ color: "#ff6b6b", fontSize: 12 }}>
                    Tacos Hamid
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name="star"
                        size={20}
                        color="#c0890aff"
                      />
                      <Text>4,1</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={{ fontSize: 15, fontVariant: "bold" }}>
                        $30.00
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Explore Section */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginStart: 10,
            marginEnd: 10,
          }}
        >
          <View style={styles.line} />
          <Text style={styles.sectionTitle}>What's on Your Mind ?</Text>
          <View style={styles.line} />
        </View>
        <Categories />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginStart: 10,
            marginEnd: 10,
          }}
        >
          <View style={styles.line} />
          <Text style={styles.sectionTitle}>EXPLORE</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>🏷️ Offers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>👑 Premium</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>🏆 Top 30</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>🚚 Food on Trip</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Recommended</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Collections</Text>
          </TouchableOpacity>
        </View>

        {/* Restaurant Cards */}
        <Text style={styles.restaurantCountText}>
          500+ RESTAURANTS DELIVERING TO YOU
        </Text>
        <View style={styles.restaurantsContainer}>
          {restaurants.map((restaurant) => (
            <TouchableOpacity key={restaurant.id} style={styles.restaurantCard}>
              <Image
                source={{ uri: restaurant.image }}
                style={styles.restaurantImage}
              />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <View style={styles.restaurantMeta}>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>
                      ⭐ {restaurant.rating}
                    </Text>
                  </View>
                  <Text style={styles.metaText}>🕐 {restaurant.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 80,
  },
  headerSection: {
    height: 430,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  imageBackground: {
    height: 400,
    backgroundPosition: "bottom",
  },

  bgImage: {
    position: "absolute",
    top: 80,
  },

  locationBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  userIcon: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // light grey background
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 10,
    width: "70%",
    marginLeft: 20,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: "#999",
  },
  micIcon: {
    fontSize: 18,
  },
  promoBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  orderBtn: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  orderBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  promoIcon: {
    fontSize: 48,
  },
  flashSaleCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#ffe0e0",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#ff6b6b",
  },
  BestPromotion: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  Popular: {
    marginHorizontal: 16,
    paddingHorizontal: 12,
  },
  BestPOthers: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    borderColor: "#ff6b6b",
  },

  BestPheader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  // BestPCards: {

  // },
  BestPCardsItem: {
    width: 230,
    height: 200,
    marginTop: 10,
    backgroundColor: "#fff",
    paddingBottom: 8,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: 10,
    borderRadius: 10,
    paddingBottom: 15,
    marginRight: 10,
  },
  PCardsItem: {
    width: 140,
    height: 200,
    marginTop: 10,
    backgroundColor: "#fff",
    paddingBottom: 8,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: 10,
    borderRadius: 10,
    paddingBottom: 15,
    marginRight: 10,
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  line: {
    flex: 1, // Makes the line take up all available space
    height: 1, // Thickness of the line
    backgroundColor: "#E0E0E0", // Light gray color
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  iconText: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    maxWidth: 60,
  },
  filterRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
  },
  filterText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 16,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  restaurantCountText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
    marginHorizontal: 16,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  restaurantsContainer: {
    marginHorizontal: 16,
  },
  restaurantCard: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  restaurantImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#f0f0f0",
  },
  restaurantInfo: {
    paddingVertical: 10,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  restaurantMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: "#d4edda",
    borderRadius: 4,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#27ae60",
  },
  metaText: {
    fontSize: 11,
    color: "#666",
  },
  bottomNav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  navItemActive: {
    borderBottomColor: "#ff6b6b",
  },
  navText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
});
