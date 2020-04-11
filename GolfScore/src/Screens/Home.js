/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React,{Component} from 'react';
//import ImagePicker from 'react-native-image-picker';
import {Actions} from 'react-native-router-flux'
import config from './../../config.json';
import googleAPI from '../api/googleApi'
import {Icon} from 'native-base'
import {connect} from 'react-redux'
import ImagePicker from 'react-native-image-crop-picker'

import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  Button,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native';
import ScoreList from '../Components/ScoreLists'
import axios from 'axios';
import { thisExpression } from '@babel/types';
const options = {
        title: 'Choose Avatar',
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
        quality: 0.6,
        tintColor : '#FFFFFF'
};

class Home extends Component {
    
    constructor(props) {
        super(props);
        this.array = []
        this.state = {
            arrayHolder: [['121233232323232323123133','123']],
            showIndicator:false,
            image : null,
            text : true,
            textInput_Holder: ''
        }

    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const array = [...this.state.arrayHolder]
        console.log(nextProps.texts)
        array.push(nextProps.texts)
        this.setState({arrayHolder : array})
    }

    onPressButton () {
    //   Actions.ScoreView({texts: [['P1','1','2','3','4','4','3','5','4','4'],['P2','4','2','3','4','3','4','4','3','5'],['P3','1','3','3','4','5','6','4','5','3']]})
       //this.showImagePicker()
       ImagePicker.openPicker({
            height: 190,
            width : 500,
            cropping: true,
            includeBase64 : true
        }).then(image => {
            this.setState({
                      showIndicator: true
             })
             googleAPI.postImage(image.data,(err,data) => {
                    console.log(data)
                    this.setState({
                      showIndicator: false
                    })
             })     
        });

    }

    gotoSearchScreen = () => {
        Actions.SearchScreen();
    }

    render(){
        return(
            <View style={styles.container}>
                 <View style = {{width : 300 , height : 300, marginTop : 0}}>
                    <Image source={require('./logo.png')} style={{flex:1 , width: undefined, height: undefined}}/>
                 </View>
                 <View style = {styles.courseView}>
                    <Text style ={{marginTop : 0,fontSize : 40 , color : '#000000',fontFamily: 'Avenir Next'}}>{this.props.courseName}</Text>
                    <Text style ={{marginTop : 5,fontSize : 40,fontFamily: 'Avenir Next'}}> Golf Course</Text>
            
                    <View style = {{marginTop : 40}}>
                        <TouchableOpacity onPress = {()=>{this.gotoSearchScreen()}}>
                            <Text style = {{fontSize : 30,color : '#0000FF',fontFamily: 'Avenir Next'}}>Change Golf Course</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style = {styles.buttonView}>
                    <TouchableOpacity onPress = {()=>{this.onPressButton()}}>
                         <Icon type="FontAwesome" name="camera-retro" style = {{fontSize : 70,color : '#000000'}}/>
                    </TouchableOpacity>
                </View>

                <View>
                    {this.state.showIndicator && 
                    <View style = {styles.indicatorView}> 
                        <View style = {styles.loading}>
                            <ActivityIndicator size ="large" color = "#FFFFFF"  animating = {this.state.showIndicator} style={{justifyContent : 'center'}}/>
                        </View>
                    </View>
                    }
                </View>
             </View>
        );
    }

    // showImagePicker = () => {
    //     ImagePicker.showImagePicker(options, (response) => {
    //     if (response.didCancel) {
    //         console.log('User cancelled image picker');
    //     } else if (response.error) {
    //         console.log('ImagePicker Error: ', response.error);
    //     } else if (response.customButton) {
    //         console.log('User tapped custom button: ', response.customButton);
    //     } else {
    //         const source = { uri: response.uri };
          
    //         this.setState({
    //             image: response,
    //             showIndicator: true
    //         });
            // googleAPI.postImage(response.data,(err,data) => {
            //         console.log(data)
            //         this.setState({
            //           showIndicator: false
            //         })
            //         Actions.ScoreView({texts: data})
    //         })
    //    }
    //       });
    // }

}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    backgroundColor : 'white',
    flexDirection: 'column',
    //justifyContent : 'center',
    alignItems : 'center',
    backgroundColor : '#F5F5F5'
  },
    button: {
    },

  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 0,
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  text: {
    fontSize: 20,
    color : "#000000",
  },
  buttonView: {
      position : 'absolute',
      alignSelf : 'center',
      bottom : 50,
  },
  loading : {
      position : 'absolute',
      width : 100,
      height : 100,
      alignItems : 'center',
      justifyContent : 'center',
      borderWidth : 1,
      borderRadius : 6,
      backgroundColor : '#000000',
      opacity : 0.8,
     
  },
  image : {
      height : 300,
      width : 250,

  },
  indicatorView : {
      flex : 1,
      justifyContent : 'center',
      position: 'absolute',
      bottom : 0,
      top : 0,
      alignItems : 'center'
  },
  courseView : {
      alignItems : 'center', 
      marginTop : -40,
      padding : 20,
      borderRadius : 20,
      backgroundColor : '#FFFFFF' ,
      shadowColor: "#000", 
      shadowOffset: { width: 0, height: 2, }, 
      shadowOpacity: 0.25,
  }
    
})

const mapStateToProps = state => ({
    courseName : state.courseName
});

export default connect(mapStateToProps)(Home)
