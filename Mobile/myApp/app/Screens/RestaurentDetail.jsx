import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { Image, ScrollView, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useState } from 'react';
import { useNavigation } from 'expo-router';




export default function RestaurentDetails() {

    const [selectedCategory, setCategoryChanged] = useState("Popular");

    const navigation = useNavigation();

    const ChangeCategory=(category)=>{
        setCategoryChanged(category);
    }
    return (
        <ScrollView style={{backgroundClolor:"#ffffff",}}>
            <View style={{marginTop:40}}>
                <Image source={{uri:"https://www.foodandwine.com/thmb/cGck0zyTmvXsIGikrK74NOtxDfg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Worlds-Largest-Fast-Food-Chains-FT-7-BLOG0623-bfe2e2be015e471b83b992cf28d476d5.jpg"}} 
                style={{width:"100%",height:300}} />

                <Text style={styles.title}>La Pasta House</Text>
                <Feather style={{position:"absolute", top:20, left:20}} name="arrow-left-circle" color="#ffffff" size={35} />
                <Feather style={{position:"absolute", top:20, right:20}} name="heart" color="#ff0000" size={34} />
            </View>
            <View style={styles.bar}>
                <View style={styles.barItem}><Text style={{fontSize:16}}>👌Italien</Text></View>
                <View style={styles.barItem2}><Icon name="star" size={19} color="#d05412" /><Text style={{fontSize:16}}> 4,5</Text></View>
                <View style={styles.barItem}><Text style={{fontSize:16}}>🛵20min</Text></View>
            </View>
            <View style={styles.info} >
                 <Text style={{fontSize:18,paddingRight:10}}>Menu</Text>
                    <View style={styles.container2}>
                         <TextInput
                           placeholder="Search..."
                           style={styles.input}
                           placeholderTextColor="#888"
                         />
                         <Feather  name="search" color="#adadad" size={20} style={styles.icon}/>
                    </View>                   

             </View>

                <View style={styles.menuContainer}>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <View style={styles.menuCat}>

      <TouchableOpacity onPress={() => ChangeCategory('Popular')}>
        <Text style={selectedCategory === 'Popular' ? styles.menuItem1 : styles.menuItem}>
          Popular
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => ChangeCategory('Pizza')}>
        <Text style={selectedCategory === 'Pizza' ? styles.menuItem1 : styles.menuItem}>
          Pizza
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => ChangeCategory('Burger')}>
        <Text style={selectedCategory === 'Burger' ? styles.menuItem1 : styles.menuItem}>
          Burger
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => ChangeCategory('Soup')}>
        <Text style={selectedCategory === 'Soup' ? styles.menuItem1 : styles.menuItem}>
          Soup
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => ChangeCategory('Jus')}>
        <Text style={selectedCategory === 'Jus' ? styles.menuItem1 : styles.menuItem}>
          Jus
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => ChangeCategory('Ice Drinks')}>
        <Text style={selectedCategory === 'Ice Drinks' ? styles.menuItem1 : styles.menuItem}>
          Ice Drinks
        </Text>
      </TouchableOpacity>

    </View>
  </ScrollView>
   

     <ScrollView showsVerticalScrollIndicator={false} style={{height:"max-height", marginTop:10}}>
        <View style={styles.itemsMenu}>
          <TouchableOpacity onPress={() => navigation.navigate("FoodDetailsScreen")} style={styles.items}>
          
                <Image style={{width:150, height:150}} source={{uri:"https://pngimg.com/d/kfc_food_PNG2.png"}} />
                <Text style={{fontSize:18, fontWeight:"bold", color:"#ffffff"}}>Chicken Burger</Text>
                <Text style={{fontSize:11, alignSelf:"center", color:"#ffffff"}}>Description of Chicken</Text>
                <Text style={styles.prices}>$5.99</Text>
         
            </TouchableOpacity>
            <View style={styles.items}>
                <Image style={{width:150, height:150}} source={{uri:"https://pngimg.com/d/kfc_food_PNG2.png"}} />
                <Text style={{fontSize:18, fontWeight:"bold", color:"#ffffff"}}>Chicken Burger</Text>
                <Text style={{fontSize:11, alignSelf:"center", color:"#ffffff"}}>Description of Chicken</Text>
                <Text style={styles.prices}>$5.99</Text>
            </View>
            <View style={styles.items}>
                <Image style={{width:150, height:150}} source={{uri:"https://pngimg.com/d/kfc_food_PNG2.png"}} />
                <Text style={{fontSize:18, fontWeight:"bold", color:"#ffffff"}}>Chicken Burger</Text>
                <Text style={{fontSize:11, alignSelf:"center", color:"#ffffff"}}>Description of Chicken</Text>
                <Text style={styles.prices}>$5.99</Text>
            </View>
            <View style={styles.items}>
                <Image style={{width:150, height:150}} source={{uri:"https://pngimg.com/d/kfc_food_PNG2.png"}} />
                <Text style={{fontSize:18, fontWeight:"bold", color:"#ffffff"}}>Chicken Burger</Text>
                <Text style={{fontSize:11, alignSelf:"center", color:"#ffffff"}}>Description of Chicken</Text>
                <Text style={styles.prices}>$5.99</Text>
            </View>
           
            
        </View>
     </ScrollView>
</View>

        </ScrollView>
    );
}


const styles = StyleSheet.create({
    infoContainer:{
        padding:16,
        paddingLeft:28
    },
    title:{
        fontSize:30,
        fontWeight:"bold",
        position:"absolute",
        top:210,
        color:"#ffffff",
    },
    description:{
        fontSize:13,
        marginTop:5
    },
    bar:{
        alignItems:"center",
        alignSelf:"center",
        flexDirection:"row",
        justifyContent:"space-around",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        width:"80%",
        borderRadius:10,
        marginTop:-30,
        zIndex:1000,
        backgroundColor:"#ffffff",
    },
    barItem: {
        display:"flex",
        padding: 20,
        paddingHorizontal:10,
        alignContent: "center",
        justifyContent: "center",
        
    },
    barItem2: {
        flexDirection:"row",
        padding: 20,
        paddingVertical:10,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        alignItems: "center",
        justifyContent: "center",

    },
    menuContainer:{
        marginTop:10,
        
        marginLeft:10,
        width:"90%",
       
       height:"max-content",
       
       alignContent:"center",
       
       
    },
    menuItem:{
        fontSize:16,
         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor:"#ffffff",
        borderRadius:10,
        padding:10,
        marginRight:18,
        marginBottom:10,
    
    },
    menuItem1:{
        fontSize:16,
         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor:"#ff6347",
        color:"#ffffff",
        borderRadius:10,
        padding:10,
        marginRight:18,
        marginBottom:10,
    
    },
    menuCat:{
        marginLeft:14,
        width:"70%",
        flexDirection:"row",
        justifyContent:"space-between",

        
    } ,
    //search bar
    container2: {
        
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eeeeee',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    width: '50%',
  },
  icon: {
    marginRight: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },

  //end search bar
  info:{
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    height:50,
    paddingHorizontal:20,
    justifyContent:"space-between",

  } ,
  itemsMenu : {
    flexDirection:"row",
    flexWrap:"wrap",
    width:"100%",
    justifyContent:"space-between",
    

  },
 items:{
        height:260,
        width:"48%",
        marginBottom:20,
        backgroundColor:"#1A1A2E",
        flexDirection:"column",
        alignItems:"center",
        paddingVertical:20,
        paddingHorizontal:5,
        borderRadius:15,
        paddingBottom:20,
        
    }
     ,
     prices:{
       width:"80%",
       backgroundColor:"#ffffffff",
       padding:9,
       marginTop:5,
       borderRadius:10,
        textAlign:"center",
        marginBottom:5,
     }


});