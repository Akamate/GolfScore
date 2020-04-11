import React from 'react'
import {View,Text} from 'react-native'
import {Icon} from 'native-base'

export default HomeTab = (props) => {
    let textColor = props.focused ? '#333333' : '#999999'
    let borderColor = props.focused ? '#333333' : '#FFFFFF'

    return (
        <View style={{flex: 1, flexDirection:'column', alignItems:'center', justifyContent:'center', borderTopColor: borderColor, borderTopWidth:4, padding:20}}>
           <Icon type="FontAwesome" name="home" style = {{fontSize : 1}}/>
           <Text style={{color: textColor}}>HOME</Text>
        </View>
    );
}

