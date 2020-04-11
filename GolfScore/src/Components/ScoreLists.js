import React from 'react'
import {View,Text,Button,StyleSheet,TouchableOpacity} from 'react-native'
import {Actions} from 'react-native-router-flux'

export default ScoreLists = ({text}) => {
    
    const onPressButton = () => {
        Actions.ScoreView({texts: [['P1','1','2','3','4','1','2','3','4','1','2','3','4'],['P2','4','2','3','4','1','2','3','4'],['P3','1','3','3','4','1','2','3','4']]})
    }

    return (
        <TouchableOpacity style = {styles.container} onPress = {()=>{onPressButton()}} >
             <Text style = {styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container : {
        borderWidth : 1,
        marginHorizontal : 20,
        paddingVertical : 10,
        paddingHorizontal : 10,
        marginVertical : 10,
        borderRadius : 5
    },
    text : {
        fontSize : 20
    }
})