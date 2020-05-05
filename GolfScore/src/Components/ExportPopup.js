import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'

export default (ExportPopup = ({ onClosePopup, onPressSingle, onPressMultiple, multiple }) => {
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                onClosePopup()
            }}
        >
            <View
                style={{
                    backgroundColor: 'rgba(0,0,0, 0.6)',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignContent: 'center'
                }}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.popupContainer}>
                        <Text style={([styles.buttonText], { fontSize: 25 })}>Export</Text>
                        <Text style={([styles.buttonText], { marginBottom: 40, fontSize: 25 })}>
                            Single or Multiple
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.buttonView} onPress={onPressSingle}>
                                <Text style={styles.buttonText}>Single</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.buttonView, { opacity: multiple ? 1 : 0.5 }]}
                                onPress={onPressMultiple}
                                disabled={!multiple}
                            >
                                <Text style={styles.buttonText}>Multiple</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    )
})

const styles = StyleSheet.create({
    popupContainer: {
        position: 'absolute',
        width: 250,
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        opacity: 1,
        alignSelf: 'center',
        alignContent: 'center',
        zIndex: 2
    },
    titleText: {
        marginTop: 5,
        fontSize: 25,
        color: '#000000',
        textAlign: 'center'
    },
    buttonText: {
        fontSize: 20,
        color: '#ffffff',
        textAlign: 'center'
    },
    buttonView: {
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#44D362',
        marginTop: 30,
        width: 100,
        marginRight: 10,
        alignItems: 'center'
    }
})
