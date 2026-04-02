import Nav from "../component/Nav"
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
import { ScrollViewComponent } from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // professional, lightweight icons
import { useNavigation } from "expo-router";


export default function RestaurentsScreen() {


    const navigator = useNavigation();
 
    const goToResto = () => {
      navigator.navigate("RestaurentDetails");
    }
    return (
        
        <ScrollView showsVerticalScrollIndicator={false} style={{marginTop:StatusBar.currentHeight,paddingHorizontal: 16}} >
            <Nav/>
            <Text style={styles.title}>Restaurants</Text>
            <View>
                <View style={styles.categoryHeader}>
                     <Text style={{fontWeight:"bold",fontSize:20}}>Categories</Text>
                     <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                     </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:20,}}>
                    <TouchableOpacity style={styles.categoryCard}>
                        <Image source={{uri:"https://static.vecteezy.com/system/resources/previews/060/818/215/non_2x/a-plate-of-fresh-seafood-including-lobster-shrimp-and-lemon-png.png"}}
                        style={{width:150,height:"75%",borderRadius:10,alignSelf:"center"}}/>
                        <Text style={{fontWeight:"bold",fontSize:16,paddingLeft:10,paddingTop:10}}>Burgers</Text>
                        <Text style={{paddingLeft:10,fontSize:10}}>49 places</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.categoryCard}>
                        <Image source={{uri:"https://static.vecteezy.com/system/resources/previews/060/818/215/non_2x/a-plate-of-fresh-seafood-including-lobster-shrimp-and-lemon-png.png"}}
                        style={{width:150,height:"75%",borderRadius:10,alignSelf:"center"}}/>
                        <Text style={{fontWeight:"bold",fontSize:16,paddingLeft:10,paddingTop:10}}>Burgers</Text>
                        <Text style={{paddingLeft:10,fontSize:10}}>49 places</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.categoryCard}>
                        <Image source={{uri:"https://static.vecteezy.com/system/resources/previews/060/818/215/non_2x/a-plate-of-fresh-seafood-including-lobster-shrimp-and-lemon-png.png"}}
                        style={{width:150,height:"75%",borderRadius:10,alignSelf:"center"}}/>
                        <Text style={{fontWeight:"bold",fontSize:16,paddingLeft:10,paddingTop:10}}>Burgers</Text>
                        <Text style={{paddingLeft:10,fontSize:10}}>49 places</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.categoryCard}>
                        <Image source={{uri:"https://static.vecteezy.com/system/resources/previews/060/818/215/non_2x/a-plate-of-fresh-seafood-including-lobster-shrimp-and-lemon-png.png"}}
                        style={{width:150,height:"75%",borderRadius:10,alignSelf:"center"}}/>
                        <Text style={{fontWeight:"bold",fontSize:16,paddingLeft:10,paddingTop:10}}>Burgers</Text>
                        <Text style={{paddingLeft:10,fontSize:10}}>49 places</Text>
                    </TouchableOpacity>
                </ScrollView>
                <Text style={{fontSize:20,fontWeight:"bold", marginTop:20}}>Popular Restaurants</Text>
            <ScrollView Vertical >
              <TouchableOpacity onPress={goToResto} >
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
              </TouchableOpacity>
            </ScrollView>
                

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title:{
        fontSize:27,
        fontWeight:"bold",
        
    } ,
     
    categoryHeader:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginTop:30,
        alignItems:"center"
    }
 ,
    seeAll:{
        borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    borderColor: "#ff6b6b",
    }
    ,
    categoryCard: {
       width: 150,
       height: 200,
       backgroundColor: "#ffffff",
       paddingBottom: 8,
       boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
       marginBottom: 10,
       borderRadius: 10,
       paddingBottom: 15,
       marginRight: 10,
    } ,

     BestPCardsItem: {
    width: "100%",
    height: 230,
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

})