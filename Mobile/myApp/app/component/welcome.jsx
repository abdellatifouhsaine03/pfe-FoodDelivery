import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  ImageBackground,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useNavigation } from "expo-router"
import Constants from "expo-constants";


const { width, height } = Dimensions.get("window")


export default function WelcomeScreen() {

    const navigate = useNavigation();

    const Login = () => {
        navigate.navigate('CreateAccount')
    }


  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={{
          uri: "https://i.pinimg.com/736x/1c/80/6f/1c806f5ab8caf536e2d4526ad4b832ce.jpg",
        }}
        style={styles.backgroundImage}
        imageStyle={{ opacity:1}}
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.52)", "rgba(255, 255, 255, 1)"]}
          start={{ x:1, y: 0.5 }}
          end={{ x:0.5, y:1 }}
          style={styles.gradient}
        >
          <View style={styles.container}>
            {/* Top Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.titleText}>
                <Text style={styles.fastText}>GOBITE </Text>
                <Text style={styles.foodText}>Food</Text>
              </Text>
            </View>

            {/* Center Burger Image Section */}

            {/* Bottom CTA Section */}
            <View style={styles.ctaSection}>
              {/* Get Started Button */}
              <TouchableOpacity style={styles.getStartedButton} onPress={Login} >
                <Text style={styles.getStartedText}>Get Started</Text>
              </TouchableOpacity>

              {/* Sign in with Text */}
              <View style={{ flexDirection: "row" , alignItems: "center" , marginStart: 10,marginEnd:10}}>
              <View style={styles.line} />
              <Text style={styles.signInText}> Sign in with </Text>
              <View style={styles.line} />
              </View>

              {/* Social Icons */}
              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialIcon}>
                  <Text style={styles.socialIconText}>f</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                  <Text style={[styles.socialIconText, styles.googleText]}>G</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                  <Text style={styles.socialIconText}>𝕏</Text>
                </TouchableOpacity>
              </View>

              {/* Sign Up Link */}
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "70%",
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  titleSection: {
    justifyContent: "flex-start",
    paddingTop: 16,
   
    
  },
  titleText: {
    fontSize: 48,
    fontWeight: "700",
  },
  fastText: {
    color: "#FFFFFF",
  },
  foodText: {
    color: "#22C55E",
    fontWeight: "700",
  },
    line: {
    flex: 1,                // Makes the line take up all available space
    height: 1,              // Thickness of the line
    backgroundColor: '#fbfbfbff', // Light gray color
  },
  imageSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxHeight: height * 0.35,
  },
  burgerImage: {
    width: "80%",
    height: "100%",
    resizeMode: "contain",
  },
  ctaSection: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 10,
    gap: 12,

  },
  getStartedButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 28,
    width: "70%",
    alignItems: "center",
    marginBottom: 25,
  },
  getStartedText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  signInText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 8,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginVertical: 8,
  },
  socialIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  socialIconText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  googleText: {
    color: "#4285F4",
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  signUpText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "500",
  },
  signUpLink: {
    color: "#FF6B35",
    fontSize: 13,
    fontWeight: "700",
  },
})
