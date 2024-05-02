//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import { colors } from '../../styles';

// create a component
class Splash extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={{width:'100%',height:'100%'}}>
        <Image source={require('./Splash.png')} resizeMode='stretch' style={{width:'102%',height:'101%',marginLeft:-5}} />
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:colors.secondaryColor
  },
});

//make this component available to the app
export default Splash;
