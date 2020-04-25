import React from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'

export default (CustomButton = ({ title, onPress, disable }) => {
    return (
        <TouchableOpacity style={[styles.buttonTouchable, { backgroundColor: disable ? '#323232' : '#44D362' }]} onPress={onPress} disabled={disable}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
})

const styles = StyleSheet.create({
    buttonTouchable: {
        borderRadius: 30,
        borderWidth: 0,
        paddingHorizontal: 60,
        paddingVertical: 15,
        backgroundColor: '#44D362',
        marginBottom: 20
    },
    buttonText: {
        fontSize: 20,
        color: '#FFFFFF',
        textAlign: 'center'
    }
})
