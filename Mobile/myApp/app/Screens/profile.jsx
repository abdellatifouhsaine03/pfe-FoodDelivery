import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react"
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet } from "react-native"

const ProfileScreen = () => {
  const menuItems = [
    { label: "My Profile", icon: "👤" },
    { label: "My Orders", icon: "📦" },
    { label: "Delivery Address", icon: "📍" },
    { label: "Payments Methods", icon: "💳" },
    { label: "Contact Us", icon: "✉️" },
    { label: "Settings", icon: "⚙️" },
    { label: "Help & FAQ", icon: "❓" },

  ]

  const [user, setUser] = useState(null);

    useEffect(async ()=>{
    try {
       const user = await AsyncStorage.getItem('user');
       setUser(user);

    }
    catch (error) {
        console.log("Error retrieving user data:", error);
    }
   },[])
   
 


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {/* Profile Avatar - Replace with actual Image component */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.avatar} />
          </View>

          {/* Name */}
          <Text style={styles.name}>{user}</Text>

          {/* Email */}
          <Text style={styles.email}>kattyberry@gmail.com</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer for bottom nav */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Bottom Navigation */}
    
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FF9500",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666666",
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: "center",
  },
  menuLabel: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
  },
  logoutContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: "#FF9500",
    borderRadius: 24,
    minWidth: 150,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF9500",
  },
  spacer: {
    height: 40,
  },
  bottomNav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  bottomNavItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  bottomNavItemActive: {
    backgroundColor: "#FFF8F0",
  },
  bottomNavIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  bottomNavLabel: {
    fontSize: 11,
    color: "#666666",
    fontWeight: "500",
  },
  bottomNavLabelActive: {
    color: "#FF9500",
    fontWeight: "600",
  },
})

export default ProfileScreen
