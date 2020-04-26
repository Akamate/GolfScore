import React from 'react'
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Icon } from 'native-base'

export default (ScoreLists = ({ holes, hole, par, hcp, scores, onEditingScore, editable, removeable, removePlayer, isComplete, isPageOne }) => {
    editable = editable === undefined ? false : editable
    removeable = removeable === undefined ? false : removeable
    hole = hole === undefined ? 0 : hole
    isPageOne = isPageOne === undefined ? true : isPageOne

    column = [0, 1, 2]
    for (i = 0; i < scores.length; i++) column.push(3 + i)

    const sumPar = startIndex => {
        var sum = 0
        for (i = startIndex; i < startIndex + 9; i++) {
            sum += parseInt(par[i])
        }
        return sum
    }

    const holeElement = () => {
        element = []
        if (isPageOne) {
            for (i = 0; i < 9; i++) {
                element.push(
                    <View>
                        <Text style={styles.row0}>{i + hole + 1}</Text>
                    </View>
                )
            }
        } else {
            for (i = 0; i < 9; i++) {
                element.push(
                    <View>
                        <Text style={styles.row0}>{i + 10}</Text>
                    </View>
                )
            }
        }
        return element
    }

    const parElement = () => {
        element = []
        if (isPageOne) {
            for (i = 0; i < 9; i++) {
                element.push(
                    <View>
                        <Text style={styles.row0}>{hole == 9 ? par[i + 10] : par[i]}</Text>
                    </View>
                )
            }
        } else {
            for (i = 0; i < 9; i++) {
                element.push(
                    <View>
                        <Text style={styles.row0}>{par[i + 10]}</Text>
                    </View>
                )
            }
        }
        return element
    }

    const hcpElement = () => {
        element = []
        if (isPageOne) {
            for (i = 0; i < 9; i++) {
                element.push(<Text style={styles.row0}>{hcp[i + hole]}</Text>)
            }
        } else {
            for (i = 0; i < 9; i++) {
                element.push(<Text style={styles.row0}>{hcp[i + 9]}</Text>)
            }
        }
        return element
    }

    const scoreElement = index => {
        element = []
        if (isPageOne) {
            for (i = 0; i < 10; i++) {
                holeNumber = 0
                if (i < 9) {
                    element.push(
                        <View>
                            <TextInput
                                style={styles.column0}
                                value={scores[index][i].toString()}
                                returnKeyType="done"
                                keyboardType="number-pad"
                                onChangeText={text => onEditingScore(text, index, y)}
                                editable={editable}
                            />
                            {/* <Text style={styles.column0}>{scores[index][i]}</Text> */}
                            <Text style={{ marginTop: 0, textAlign: 'center', marginBottom: 3, fontSize: 15 }}>
                                {scores[index][i] != '' ? scores[index][i] - parseInt(par[i]) : '  '}
                            </Text>
                        </View>
                    )
                    holeNumber += 1
                } else {
                    element.push(<Text style={[styles.totalScore, { backgroundColor: '#033922', color: '#ffffff' }]}>{scores[index][i]}</Text>)
                }
            }
        } else {
            for (i = 0; i < 10; i++) {
                if (i < 9) {
                    element.push(
                        <View>
                            <Text style={styles.column0}>{scores[index][i + 10]}</Text>
                            <Text style={{ marginTop: 0, textAlign: 'center', marginBottom: 3, fontSize: 15 }}>
                                {scores[index][i + 10] != '' ? scores[index][i + 10] - parseInt(par[i + 10]) : '  '}
                            </Text>
                        </View>
                    )
                } else {
                    element.push(<Text style={[styles.totalScore, { backgroundColor: '#033922', color: '#ffffff' }]}>{scores[index][i + 10]}</Text>)
                }
            }
        }
        return element
    }

    return (
        <View style={{ alignItems: 'center' }}>
            <FlatList
                style={{ padding: 10, marginLeft: 0, marginRight: 0, marginTop: 0, borderRadius: 10 }}
                horizontal
                howsHorizontalScrollIndicator={true}
                bounces={false}
                data={column}
                renderItem={({ item, key }) => (
                    <View>
                        {item == 0 ? (
                            <View>
                                <Text style={[styles.row0, { marginBottom: 0, borderTopEndRadius: 10, overflow: 'hidden' }]}>HOLE</Text>
                                {holeElement()}
                                <Text style={styles.totalScore}>{isPageOne ? 'IN' : 'OUT'}</Text>

                                {isComplete && scores[0].length > 14 && <Text style={styles.totalScore}>TOT</Text>}
                                {isComplete ? (
                                    <View>
                                        <Text style={styles.totalScore}>H/C</Text>
                                        <Text style={styles.totalScore}>NET</Text>
                                    </View>
                                ) : null}
                            </View>
                        ) : null}
                        {item == 1 ? (
                            <View>
                                <Text style={[styles.row0, { marginBottom: 0 }]}>PAR</Text>
                                {parElement()}
                                <Text style={styles.totalScore}>{isPageOne ? par[9] : par[19]}</Text>
                                {scores[0].length >= 15 && <Text style={styles.totalScore}>{par[20]}</Text>}
                            </View>
                        ) : null}
                        {item == 2 ? (
                            <View>
                                <Text style={[styles.row0, { marginBottom: 0 }]}>HCP</Text>
                                {hcpElement()}
                            </View>
                        ) : null}
                        {item > 2 ? (
                            <View>
                                <Text style={styles.column0}>P{item - 2}</Text>
                                {scoreElement(item - 3)}
                                {scores[0].length >= 15 && <Text style={[styles.totalScore]}>{scores[item - 3][20]}</Text>}

                                {scores[0].length <= 13 && isComplete && <Text style={[styles.totalScore]}>{scores[item - 3][10]}</Text>}
                                {scores[0].length >= 13 && isComplete && <Text style={[styles.totalScore]}>{scores[item - 3][21]}</Text>}

                                {scores[0].length <= 13 && isComplete && <Text style={[styles.totalScore]}>{scores[item - 3][11]}</Text>}
                                {scores[0].length >= 13 && isComplete && <Text style={[styles.totalScore]}>{scores[item - 3][22]}</Text>}

                                {editable ? (
                                    <TouchableOpacity
                                        onPress={() => {
                                            removePlayer(item - 3)
                                        }}
                                        style={{ marginLeft: 0, marginBottom: 0, padding: 6, alignItems: 'center' }}
                                    >
                                        <Icon type="FontAwesome" name="remove" style={{ fontSize: 30, color: '#FF0000' }} />
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        ) : null}
                    </View>
                )}
                keyExtractor={item => item.id}
            />
        </View>
    )
})

const styles = StyleSheet.create({
    column0: {
        textAlign: 'center',
        borderWidth: 0,
        padding: 6,
        backgroundColor: '#ffffff',
        fontSize: 20,
        borderRadius: 2,
        height: 40,
        width: 60,
        borderWidth: 1
    },

    totalScore: {
        textAlign: 'center',
        marginBottom: 0,
        padding: 6,
        fontSize: 20,
        width: 60,
        marginTop: 0,
        backgroundColor: '#033922',
        color: '#ffffff'
    },

    row0: {
        marginBottom: 21,
        borderColor: '#000000',
        padding: 6,
        backgroundColor: '#44D362',
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20,
        width: 60,
        textAlign: 'center',
        height: 40
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
    },
    diffParScore: {
        height: 20,
        textAlign: 'center',
        fontSize: 15,
        backgroundColor: '#44D362'
    }
})
