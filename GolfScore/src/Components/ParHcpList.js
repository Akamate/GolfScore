import React from 'react'
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Icon } from 'native-base'

export default (ParHcpList = ({ par, hcp }) => {
    isMorethan9Hole =
        par.filter(parAtHole => {
            return parAtHole != '' && !isNaN(parAtHole)
        }).length > 9

    column = isMorethan9Hole ? [0, 1, 2, 3, 4, 5] : [0, 1, 2]

    holeElement = indexColumn => {
        holeElements = []
        startIndex = indexColumn == 0 ? 1 : 10
        for (i = startIndex; i < startIndex + 9; i++) {
            holeElements.push(<Text style={styles.columnHole}>{i}</Text>)
        }
        return holeElements
    }

    parElement = indexColumn => {
        holeElements = []
        startIndex = indexColumn == 1 ? 0 : 9
        for (i = startIndex; i < startIndex + 9; i++) {
            holeElements.push(<Text style={styles.column0}>{par[i]}</Text>)
        }
        return holeElements
    }

    hcpElement = indexColumn => {
        holeElements = []
        startIndex = indexColumn == 1 ? 0 : 9
        for (i = startIndex; i < startIndex + 9; i++) {
            holeElements.push(<Text style={styles.column0}>{hcp[i]}</Text>)
        }
        return holeElements
    }

    sumPar = indexColumn => {
        sum = 0
        startIndex = indexColumn == 1 ? 0 : 9
        for (i = startIndex; i < startIndex + 9; i++) {
            if (!isNaN(par[i]) && par[i] != '') {
                sum += parseInt(par[i])
            }
        }
        return sum
    }

    return (
        <FlatList
            style={{ padding: 10, marginLeft: 0, marginRight: 0, marginTop: 10, marginBottom: 20 }}
            horizontal
            howsHorizontalScrollIndicator={true}
            bounces={false}
            data={column}
            renderItem={({ item, key }) => (
                <View>
                    {(item == 0 || item == 3) && (
                        <View>
                            <Text style={styles.columnHole}>HOLE</Text>
                            {holeElement(item)}
                            {item === 0 && <Text style={styles.columnHole}>IN</Text>}
                            {item === 3 && <Text style={styles.columnHole}>OUT</Text>}
                            {column.length > 3 && item == 0 && <Text style={styles.columnHole}>TOT</Text>}
                        </View>
                    )}
                    {(item === 1 || item === 4) && (
                        <View>
                            <Text style={styles.columnHole}>PAR</Text>
                            {parElement(item)}
                            <Text style={styles.columnHole}>{sumPar(item)}</Text>
                            {column.length > 3 && item === 1 && <Text style={styles.columnHole}>{sumPar(1) + sumPar(4)}</Text>}
                        </View>
                    )}
                    {(item === 2 || item === 5) && (
                        <View>
                            <Text style={styles.columnHole}>HCP</Text>
                            {hcpElement(item)}
                        </View>
                    )}
                </View>
            )}
        />
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
        width: 60
    },

    totalScore: {
        textAlign: 'center',
        marginBottom: 0,
        padding: 6,
        backgroundColor: '#ffffff',
        fontSize: 20,
        width: 60
    },

    columnHole: {
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