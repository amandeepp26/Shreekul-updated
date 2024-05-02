
import { View,Image,Text } from "react-native";
import Button from "./Button";
import { colors } from "../styles";
import styles from "../modules/navigation/styles";


export default function NotSubscribed({navigation,text,buttonText,setsubscribe}) {
  return (
    <View style={{alignItems:'center',width:'80%',justifyContent:'center',}}> 
          <Image
            source={require('../../assets/images/notSubscribed.jpg')}
            resizeMode="cover"
            style={{width: 250, height: 250}}
          />
          <Text style={[styles.h4,{textAlign:'center'}]}>
            {text}
          </Text>
          <Button text={buttonText}
          backgroundColor={colors.primaryColor}
          color={false}
          onpress={()=>navigation.navigate('MatrimonySubscription')} 
          />
        </View>
  )
}
