import React from 'react'
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Icon } from 'native-base'

export default (ScoreLists = ({ holes, hole, par, hcp, scores, onEditingScore, editable, removeable, removePlayer }) => {
    editable = editable === undefined ? false : editable
    removeable = removeable === undefined ? false : removeable
    hole = hole === undefined ? 0 : hole

    var diff = 1
    if (removeable) diff = 2

    const totalScore = playerScore => {
        var score = 0
        for (var i = 0; i < playerScore.length; i++) {
            if (!isNaN(playerScore[i]) && playerScore[i] != '') score += parseInt(playerScore[i])
        }
        return score
    }

    const playerScoreElement = holeNumber => {
        return scores.map((texts, key) => {
            if (holeNumber == 0) {
                return (
                    <View>
                        <Text style={styles.column0}>{texts[holeNumber]}</Text>
                        <Text style={{ marginLeft: 10, marginBottom: 9, padding: 3 }}> </Text>
                    </View>
                )
            } else if (holeNumber < holes.length - diff) {
                return (
                    <View>
                        <TextInput
                            returnKeyType="done"
                            style={{
                                textAlign: 'center',
                                marginLeft: 10,
                                marginBottom: 0,
                                borderWidth: 1,
                                padding: 6,
                                color: '#000000',
                                fontSize: 20,
                                borderRadius: 2,
                                fontFamily: 'Avenir Next'
                            }}
                            editable={true}
                            value={texts[holeNumber]}
                            onChangeText={text => onEditingScore(text, key, holeNumber)}
                            //  keyboardType="number-pad"
                        />
                        <Text
                            style={{
                                marginLeft: 10,
                                marginBottom: 10,
                                padding: 3,
                                textAlign: 'center'
                            }}
                        >
                            {parseInt(texts[holeNumber]) - parseInt(par[holeNumber - 1]) > 0
                                ? '+' + (parseInt(texts[holeNumber]) - parseInt(par[holeNumber - 1]).toString())
                                : parseInt(texts[holeNumber]) - parseInt(par[holeNumber - 1])}
                        </Text>
                    </View>
                )
            } else if (holeNumber === holes.length - diff) {
                return (
                    <View>
                        <Text style={styles.column0}>{totalScore(texts)}</Text>
                        <Text style={{ marginLeft: 10, marginBottom: 12, padding: 3 }} />
                    </View>
                )
            } else {
                return (
                    <TouchableOpacity
                        onPress={() => {
                            removePlayer(key)
                        }}
                        style={{ marginLeft: 10, marginBottom: 25, padding: 6 }}
                    >
                        <Icon type="FontAwesome" name="remove" style={{ fontSize: 30, color: '#FF0000' }} />
                    </TouchableOpacity>
                )
            }
        })
    }

    return (
        <FlatList
            style={{ padding: 0, marginLeft: 10, marginRight: 10 }}
            horizontal
            howsHorizontalScrollIndicator={false}
            data={holes}
            renderItem={({ item, key }) => (
                <View>
                    {item < holes.length - diff ? (
                        <Text style={styles.row0}>{item === 0 ? 'Hole' : item + hole}</Text>
                    ) : (
                        <Text style={styles.row0}>{item === holes.length - diff ? 'TOT' : 'DEL'}</Text>
                    )}
                    {playerScoreElement(item)}
                    {item < holes.length - diff ? (
                        <View>
                            <Text style={item === 0 ? styles.parhcp : styles.parhcp}>{item === 0 ? 'Par' : par[item - 1 + hole]}</Text>
                            <Text style={item === 0 ? styles.parhcp : styles.parhcp}>{item === 0 ? 'Hcp' : hcp[item - 1 + hole]}</Text>
                        </View>
                    ) : null}
                </View>
            )}
            keyExtractor={item => item.id}
        />
    )
})

const styles = StyleSheet.create({
    column0: {
        textAlign: 'center',
        marginBottom: 3,
        borderWidth: 0,
        padding: 6,
        backgroundColor: '#ffffff',
        fontWeight: 'bold',
        fontSize: 20,
        borderRadius: 2,
        fontFamily: 'Avenir Next'
    },

    row0: {
        marginBottom: 10,
        marginTop: 10,
        borderWidth: 0,
        padding: 6,
        backgroundColor: '#44D362',
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20,
        width: 60,
        textAlign: 'center'
    },
    parhcp: {
        marginBottom: 0,
        marginTop: 0,
        backgroundColor: '#44D362',
        padding: 6,
        fontSize: 20,
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: 'bold',
        height: 40
    }
})
