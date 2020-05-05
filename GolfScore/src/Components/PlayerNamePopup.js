import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'

export default (PlayerNamePopup = ({ numOfPlayer, onSetPlayerName }) => {
    numOfplayerArr = []
    for (i = 0; i < numOfPlayer; i++) {
        numOfplayerArr.push(i + 1)
    }

    const [playerNames, setPlayerNames] = useState(['', '', '', '', '', ''])
    const [currentIndex, setIndex] = useState(0)
    const [isDisable, setDisable] = useState(true)
    setPlayer = (playerName, index) => {
        const playerNameArr = [...playerNames]
        playerNameArr[index] = playerName
        setPlayerNames(playerNameArr)
        checkDisableButton(playerNameArr)
    }

    savePlayerName = () => {
        if (!isDisable) {
            onSetPlayerName(playerNames.slice(0, numOfPlayer))
        }
    }

    checkDisableButton = playerNameArr => {
        var isDisable = false
        for (i = 0; i < numOfPlayer; i++) {
            if (playerNameArr[i] == '' || playerNameArr[i] == ' ' || playerNameArr[i] == '   ') {
                isDisable = true
            }
        }
        setDisable(isDisable)
        return isDisable
    }

    return (
        <TouchableWithoutFeedback>
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
                    <View style={[styles.popupContainer, { top: numOfPlayer >= 4 ? undefined : undefined }]}>
                        <Text style={([styles.buttonText], { fontSize: 25, marginTop: 30 })}>Please Insert</Text>
                        <Text style={([styles.buttonText], { marginBottom: 30, fontSize: 25, marginTop: 5 })}>
                            Player Name or Number
                        </Text>
                        <View>
                            <Text
                                style={
                                    ([styles.buttonText],
                                    { marginBottom: 10, fontSize: 25, marginTop: 5, textAlign: 'center' })
                                }
                            >
                                Player {currentIndex + 1}
                            </Text>
                            <TextInput
                                style={{
                                    width: 150,
                                    borderBottomWidth: 1,
                                    fontSize: 25,
                                    textAlign: 'center',
                                    marginBottom: 20
                                }}
                                value={playerNames[currentIndex]}
                                placeholder={`Player ${currentIndex + 1}`}
                                onChangeText={text => setPlayer(text, currentIndex)}
                                maxLength={10}
                                returnKeyType="done"
                            />
                        </View>
                        {numOfPlayer > 1 && (
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    onPress={() => (currentIndex > 0 ? setIndex(currentIndex - 1) : null)}
                                    style={styles.buttonView}
                                >
                                    <Text style={{ fontSize: 20, color: '#ffffff', textAlign: 'center' }}>
                                        {'Previous'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => (currentIndex < numOfPlayer - 1 ? setIndex(currentIndex + 1) : null)}
                                    style={styles.buttonView}
                                >
                                    <Text style={{ fontSize: 20, color: '#ffffff', textAlign: 'center' }}>
                                        {'Next'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        <TouchableOpacity
                            onPress={savePlayerName}
                            style={[styles.buttonView, { width: 150, marginBottom: 20, opacity: isDisable ? 0.5 : 1 }]}
                            disabled={isDisable}
                        >
                            <Text style={{ fontSize: 20, color: '#ffffff', textAlign: 'center' }}>{'Save'}</Text>
                        </TouchableOpacity>
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
        //height: 500,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        opacity: 1,
        alignSelf: 'center',
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
        color: '#000000',
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
