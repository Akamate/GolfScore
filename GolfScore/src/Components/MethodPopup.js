import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Icon } from 'native-base'
import { strokePlay } from '../CalculateMethod'
import { setHcp } from '../reducer/actions'

export default (MethodPopup = ({ onEndSelecting, onClosePopup }) => {
    //stroke play -> h/c
    //double prnoria -> random 6 hole each 9 hole -> can select when score 18 hole
    //modieid penoria same with penoria
    const [isStrokePlay, setStrokePlay] = useState(false)
    const [isPeoria, setPeoria] = useState(false)
    const [hcp, setHcp] = useState('')
    const [holeList, setHoleList] = useState(['', '', '', '', '', ''])
    const [name, setName] = useState('')
    const selectMethod = methodName => {
        if (methodName == 'Stable Ford' || methodName == 'System 36 Handicap') {
            onEndSelecting(methodName, null, null)
        } else if (methodName == 'Stroke Play') {
            setStrokePlay(true)
        } else if (methodName == 'Double Peoria' || methodName == 'Modified Peoria') {
            setName(methodName)
            setPeoria(true)
        }
    }
    const strokePlayElement = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <Text style={[styles.titleText, { fontWeight: 'bold', marginBottom: 30 }]}>Please Insert H/C</Text>
                <TextInput
                    style={{ width: 100, borderBottomWidth: 1, fontSize: 20, textAlign: 'center' }}
                    value={hcp}
                    placeholder={'H/C'}
                    onChangeText={text => setHcp(text)}
                    keyboardType="number-pad"
                    maxLength={2}
                    returnKeyType="done"
                />
                <TouchableOpacity
                    onPress={() => {
                        hcp != '' && !isNaN(hcp) ? onEndSelecting('Stroke Play', hcp, null) : null
                    }}
                    style={{ backgroundColor: '#44D362', borderRadius: 10, marginTop: 20, padding: 10, width: 200, height: 50 }}
                >
                    <Text style={{ fontSize: 25, color: '#ffffff', textAlign: 'center' }}>{'Select'}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    const peoriaElement = methodName => {
        return (
            <View style={{ alignItems: 'center' }}>
                <Text style={[styles.titleText, { fontWeight: 'bold', marginBottom: 30 }]}>Please Insert H/C</Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginRight: 10 }}>
                        {createTextInput(0)}
                        {createTextInput(1)}
                        {createTextInput(2)}
                    </View>
                    <View>
                        {createTextInput(3)}
                        {createTextInput(4)}
                        {createTextInput(5)}
                    </View>
                </View>
                <TouchableOpacity
                    onPress={confirmPeoria}
                    style={{ backgroundColor: '#44D362', borderRadius: 10, marginTop: 20, padding: 10, width: 200, height: 50 }}
                >
                    <Text style={{ fontSize: 25, color: '#ffffff', textAlign: 'center' }}>{'Select'}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    createTextInput = index => {
        return (
            <TextInput
                style={{ width: 100, borderBottomWidth: 1, fontSize: 25, textAlign: 'center', marginBottom: 20 }}
                value={holeList[index].value}
                placeholder={'Hole'}
                onChangeText={text => setHole(text, index)}
                keyboardType="number-pad"
                maxLength={2}
                returnKeyType="done"
            />
        )
    }

    setHole = (holeNumber, index) => {
        const holes = holeList
        holes[index] = holeNumber
        setHoleList(holes)
    }

    confirmPeoria = () => {
        filterArr = holeList.filter(hole => hole.value == '')
        if (filterArr.length == 0) {
            filterArr = holeList.map(hole => parseInt(hole))
            console.log(filterArr)
            onEndSelecting(name, null, filterArr)
        }
    }
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
                        {!isStrokePlay && !isPeoria && (
                            <View style={{ zIndex: 0 }}>
                                <Text style={[styles.titleText, { fontWeight: 'bold' }]}>Please Select Method</Text>
                                <FlatList
                                    style={{
                                        padding: 20,
                                        marginLeft: 0,
                                        marginTop: 10,
                                        flexGrow: 0,
                                        borderRadius: 10,
                                        alignContent: 'center',
                                        backgroundColor: '#F2F2F7'
                                    }}
                                    howsHorizontalScrollIndicator={false}
                                    data={['Stroke Play', 'Stable Ford', 'Double Peoria', 'Modified Peoria', 'System 36 Handicap']}
                                    renderItem={({ item, key }) => (
                                        <TouchableOpacity onPress={() => selectMethod(item)} style={{ borderRadius: 5, marginBottom: 10 }}>
                                            <Text style={styles.methodText}> {item} </Text>
                                            <View style={{ borderBottomWidth: 1, borderColor: '#FFFFFF', height: 1 }} />
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        )}
                        {isStrokePlay && strokePlayElement()}
                        {isPeoria && peoriaElement()}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
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
    methodText: {
        marginTop: 5,
        fontSize: 25,
        color: '#000000',
        textAlign: 'center'
    }
})
