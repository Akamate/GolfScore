import React from 'react'
import {View,Text,StyleSheet,TextInput} from 'react-native';

const searchBar = ({term,onChangeText,onEndEditing}) => {
    return (
        <View style={styles.background} >
            {/* <Feather name="search" size={20} style = {styles.iconStyle}/> */}
            <TextInput 
                autoCapitalize = "none"
                autoCorrect = {false}
                placeholder = "Search for Golf Course" 
                style = {styles.textInput}
                value={term}
                onChangeText = {text => onChangeText(text)}
                onEndEditing = {onEndEditing}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    background : {
        backgroundColor : '#FFFFFF',
        height : 50,
        marginHorizontal : 15,
        marginVertical : 15,
        flexDirection : 'row',
        borderRadius : 5,
    },
    textInput : {
        flex : 1
    },

    iconStyle : {
        alignSelf : 'center',
        marginHorizontal : 5
    }
})

export default searchBar;