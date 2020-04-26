import React from 'react'
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Icon } from 'native-base'

export default (MethodPopup = () => {
    return (
        <View style={{ backgroundColor: 'rgba(0,0,0, 0.6)', position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, justifyContent: 'center' }}>
            <View style={styles.popupContainer}>
                <Text style={[styles.titleText, { fontWeight: 'bold' }]}>Please Select Method</Text>
                <FlatList
                    style={{ padding: 20, marginLeft: 0, marginTop: 10, flexGrow: 0, borderRadius: 10, alignContent: 'center', backgroundColor: '#F2F2F7' }}
                    howsHorizontalScrollIndicator={false}
                    data={['strokePlay', 'stableFord', 'Double Penoria', 'Modified', 'System 36 Handicap']}
                    renderItem={({ item, key }) => (
                        <TouchableOpacity onPress={this.onPressManualButton} style={{ borderRadius: 5, marginBottom: 10 }}>
                            <Text style={styles.methodText}> {item} </Text>
                            <View style={{ borderBottomWidth: 1, borderColor: '#FFFFFF', height: 1 }} />
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    popupContainer: {
        position: 'absolute',
        width: 300,
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        opacity: 1,
        zIndex: 5,
        alignSelf: 'center',
        alignContent: 'center'
    },
    titleText: {
        arginTop: 5,
        fontSize: 25,
        color: '#000000',
        textAlign: 'center'
    },
    methodText: {
        marginTop: 5,
        fontSize: 25,
        color: '#00ff00',
        textAlign: 'center'
    }
})
