import { useNavigation } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput,Image, ScrollView, Dimensions } from "react-native"
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // professional, lightweight icons


export default function Nav() {

    const navigate = useNavigation();

      const Seer = () => {
    navigate.navigate("welecom");
  };

    return (
        <View style={styles.header}>
          <View style={styles.locationBar}>
            <Feather name="map-pin" size={20} color="#555" />
            <Text style={styles.locationText}>Ludhiana Bus Stop</Text>
            <TouchableOpacity onPress={Seer}>
              <Text style={styles.userIcon}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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
})