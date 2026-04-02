import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Entypo from "@expo/vector-icons/Entypo";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import HomeScreen from "./Screens/Home";
import PlaceholderScreen from "./component/test";
import { StyleSheet, Text } from "react-native";
import Welecome from "./component/welcome";
import LoginScreen from "./component/Login";
import ProfileScreen from "./Screens/profile";
import RestaurentsScreen from "./Screens/Restaurent"
import RestaurentDetails from "./Screens/RestaurentDetail";
import FoodDetailsScreen from "./Screens/foodDetail" 
import Cart from "./Screens/cart";


import { CartProvider } from "./cart-Context/cart"


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs for main navigation
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        hideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarStyle: Styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="home"
              size={28}
              color={focused ? "#fc5b25ff" : "#000000ff"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#fc5b25ff" : "#000000ff",
                fontSize: 9,
              }}
            >
              Home
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Restaurent"
        component={RestaurentsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="shop"
              size={28}
              color={focused ? "#fc5b25ff" : "#000000ff"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#fc5b25ff" : "#000000ff",
                fontSize: 9,
              }}
            >
              Restaurants
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Nike"
        component={PlaceholderScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="coffee"
              size={28}
              color={focused ? "#fc5b25ff" : "#000000ff"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#fc5b25ff" : "#000000ff",
                fontSize: 9,
              }}
            >
              Shop
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="ShopScreen"
        component={PlaceholderScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="cart"
              size={28}
              color={focused ? "#fc5b25ff" : "#000000ff"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#fc5b25ff" : "#000000ff",
                fontSize: 9,
              }}
            >
              Shop
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-outline"
              size={28}
              color={focused ? "#fc5b25ff" : "#000000ff"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#fc5b25ff" : "#000000ff",
                fontSize: 9,
              }}
            >
              Profile
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Root stack: tabs + global screens
function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="welecom" component={Welecome} />
      <Stack.Screen name="CreateAccount" component={LoginScreen} />
     <Stack.Screen name="RestaurentDetails" component={RestaurentDetails} />
     <Stack.Screen name="FoodDetailsScreen" component={FoodDetailsScreen} />
     <Stack.Screen name="Cart" component={Cart} />
      {/*<Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="ProfileSettingsScreen" component={ProfileSettingsScreen} /> */}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <CartProvider>
      <RootNavigator />;
    </CartProvider>
  );
}

const Styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "rgba(200, 200, 200, 0.9)", // 👈 light gray + transparent
    borderRadius: 15,
    width: "90%",
    elevation: 0,
    position: "absolute",
    bottom: 15,
    marginStart: 20,
    marginEnd: 20,
    paddingTop: 8,
    color: "#000000ff",
  },
  rootNavigator: {
    backgroundColor: "#080202ff",
  },
});
