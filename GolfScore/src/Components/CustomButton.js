import React from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'

export default (CustomButton = ({ title, onPress }) => {
    return (
        <TouchableOpacity style={styles.buttonTouchable} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
})

const styles = StyleSheet.create({
    buttonTouchable: {
        borderRadius: 30,
        borderWidth: 2,
        paddingHorizontal: 60,
        paddingVertical: 15,
        backgroundColor: '#000000',
        marginBottom: 20
    },
    buttonText: {
        fontSize: 20,
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: 'Avenir Next'
    }
})
