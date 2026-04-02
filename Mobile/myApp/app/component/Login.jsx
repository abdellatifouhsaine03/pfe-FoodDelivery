"use client"

import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput,Image, ScrollView, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useState } from "react"
import { useNavigation } from "expo-router"
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";


const { width } = Dimensions.get("window")

export default function LoginScreen({ navigation }) {

  const API = Constants.expoConfig.extra.apiUrl

  const [user, setuser] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [CoPassword, setCoPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)

  const navigate = useNavigation();


const handleSignIn = async () => {
  console.log(`${API}/api/register`)
  try {
    const res = await axios.post(
      `${API}/api/register`,
      {
        name: user,
        email,
        password,
        password_confirmation: CoPassword,
        phone: "1234567",
      },
      {
        timeout: 5000, // 5 secondes max
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const token = res.data.token;
    await AsyncStorage.setItem('token', token);

    //also save user
    await AsyncStorage.setItem('user', user);

    console.log("SUCCESS:", res.data);
    navigate.navigate("MainTabs");
  } catch (error) {
    console.log("AXIOS ERROR:", error.message);

    if (error.response) {
      console.log("API ERROR:", error.response.data);
    }
  }
};


  const handleSignUp = () => {
    // Navigate to sign up screen if available
    console.log("Navigate to sign up")
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Orange Header with Logo */}
        <LinearGradient
          colors={["#FF6B35", "#FF8A50"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerSection}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/logo1.png")}
              style={{ width: 200, height: 200, alignSelf: "center" }}
            />
          </View>
        </LinearGradient>

        {/* White Card Section */}
        <View style={styles.cardSection}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>User Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Username"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              value={user}
              onChangeText={setuser}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.eyeIcon}>
                <Text style={styles.eyeText}>👁️</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={true}
                value={CoPassword}
                onChangeText={setCoPassword}
              />
              <TouchableOpacity style={styles.eyeIcon}>
                <Text style={styles.eyeText}>👁️</Text>
              </TouchableOpacity>
            </View>
          </View>


          {/* Terms and Conditions Checkbox */}
          <View style={styles.termsContainer}>
            <TouchableOpacity style={styles.checkbox} onPress={() => setAgreeTerms(!agreeTerms)}>
              {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <View style={styles.termsTextContainer}>
              <Text style={styles.termsText}>I read and agreed to </Text>
              <Text style={styles.termsLink}>User Agreement</Text>
              <Text style={styles.termsText}> and </Text>
              <Text style={styles.termsLink}>privacy policy</Text>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} activeOpacity={0.85}>
            <Text style={styles.signInButtonText}>Sign in</Text>
          </TouchableOpacity>

          {/* Sign in with Text */}
          <Text style={styles.signInWithText}>Sign in with</Text>

          {/* Social Icons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialIcon}>
              <Text style={styles.facebookIcon}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Text style={styles.googleIcon}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Text style={styles.twitterIcon}>𝕏</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FF6B35",
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    height: 200,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",

   
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    
  },
  logoText: {
    fontSize: 32,
  },
  logoFoodText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cardSection: {
    backgroundColor: "#ffffffff",
    
    borderRadius: 44,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingVertical: 28,
    gap: 16,
    borderWidth:6,
    borderColor:"#eedfd8ff"
  },
  
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#949494ff",
    borderRadius: 19,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#000000",
    backgroundColor: "#ffffffff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#949494ff",
    borderRadius: 19,
    backgroundColor: "#ffffffff",
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 12,
    fontSize: 14,
    color: "#000000",
  },
  eyeIcon: {
    padding: 8,
  },
  eyeText: {
    fontSize: 16,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-start",
    marginTop: 4,
  },
  forgotPasswordText: {
    color: "#FF6B35",
    fontSize: 13,
    fontWeight: "600",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#949494ff",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  
  },
  checkmark: {
    color: "#FF6B35",
    fontSize: 12,
    fontWeight: "700",
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  termsText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  termsLink: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "600",
  },
  signInButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  signInWithText: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  
  },
  socialIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  facebookIcon: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1877F2",
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4285F4",
  },
  twitterIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    
  },
  signUpText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  signUpLink: {
    fontSize: 13,
    color: "#FF6B35",
    fontWeight: "700",
  },
})
