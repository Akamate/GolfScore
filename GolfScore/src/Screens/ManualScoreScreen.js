import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput, ScrollView, Platform } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'

class ManualScoreScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            holes: [],
            numOfHoles: 18,
            currentHole: 1,
            scores: [],
            numOfPlayer: 1
        }
    }

    componentDidMount() {
        this.setHoleArray()
    }

    setHoleArray = () => {
        var allHoles = []
        for (i = 0; i <= this.state.numOfHoles; i++) {
            allHoles.push({ key: i, holesNumber: i })
        }
        this.setState({ holes: allHoles }, () => {
            this.setScore()
        })
    }

    setScore() {
        const scores = []
        for (i = 0; i < this.state.numOfPlayer; i++) {
            scores.push([])
            for (j = 0; j < this.state.numOfHoles; j++) {
                scores[i].push('')
            }
        }
        this.setState({
            scores: scores,
            currentHole: 1
        })
    }

    changeNumOfPlayer = text => {
        this.setState({ numOfPlayer: text }, () => {
            this.setScore()
        })
    }

    editScore = (text, index, holesNumber) => {
        const scores = [...this.state.scores]
        scores[index][holesNumber - 1] = text
        this.setState({ scores: scores })
    }

    goBackHome() {
        Actions.reset('Home')
    }

    goToCalculateScore = () => {
        if (this.state.scores.length >= 0) {
            scores = [...this.state.scores]
            newScores = []
            var sum = 0
            scores.map((score, index) => {
                sum0 = 0
                sum1 = 0
                len = 0
                for (i = 0; i < 9; i++) {
                    if (!isNaN(score[i]) && score[i] != '') {
                        len += 1
                        sum0 += parseInt(score[i])
                    }
                }

                for (i = 9; i < this.state.numOfHoles; i++) {
                    if (!isNaN(score[i]) && score[i] != '') {
                        len += 1
                        sum1 += parseInt(score[i])
                    }
                }
                if (len < 10) {
                    newScores.push(score.slice(0, 9))
                    newScores[index].push(sum0)
                } else {
                    newScores.push(score.slice(0, 19))
                    newScores[index].splice(9, 0, sum0)
                    newScores[index].splice(19, 0, sum1)
                }
            })
            Actions.CalculateScoreScreen({ score: newScores, holes: this.state.holes })
        }
    }

    increaseNumberPlayer = () => {
        var numPlayer = this.state.numOfPlayer
        this.setState({ numOfPlayer: numPlayer + 1 }, () => {
            this.setScore()
        })
    }

    decreaseNumberPlayer = () => {
        var numPlayer = this.state.numOfPlayer
        if (this.state.numOfPlayer > 1) {
            this.setState({ numOfPlayer: numPlayer - 1 }, () => {
                this.setScore()
            })
        }
    }

    editDetailComponent = () => {
        return (
            <View style={styles.editDetailContainer}>
                <Text style={styles.hole0}>Hole {this.state.currentHole}</Text>
                {this.state.scores.map((score, index) => {
                    return (
                        <View
                            style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10, marginLeft: 5 }}
                        >
                            <TextInput
                                style={{
                                    marginLeft: 60,
                                    fontSize: 30,
                                    marginTop: Platform.OS === 'ios' ? 0 : -10,
                                    alignItems: 'center',
                                    borderBottomWidth: 1
                                }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder={'P' + (index + 1)}
                                value={score[this.state.currentHole - 1]}
                                onChangeText={text => this.editScore(text, index, this.state.currentHole)}
                                keyboardType="number-pad"
                                maxLength={1}
                                returnKeyType={'done'}
                                onSubmitEditing={() => {
                                    this.secondTextInput.focus()
                                }}
                                ref={input => {
                                    this.secondTextInput = input
                                }}
                            />
                            <Text style={{ fontSize: 30, position: 'absolute', marginLeft: 0 }}>
                                {'P' + (index + 1)}{' '}
                            </Text>
                        </View>
                    )
                })}

                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() =>
                            this.setState({ currentHole: this.state.currentHole >= 2 ? this.state.currentHole - 1 : 1 })
                        }
                        style={styles.buttonView}
                    >
                        <Text style={styles.buttonText}> Previous </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            this.setState({
                                currentHole:
                                    this.state.currentHole >= 18 ? this.state.currentHole : this.state.currentHole + 1
                            })
                        }
                        style={styles.buttonView}
                    >
                        <Text style={styles.buttonText}> Next </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => this.goToCalculateScore()} style={styles.buttonView}>
                    <Text style={styles.buttonText}> Calculate </Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {Platform.OS == 'ios' && (
                    <View style={styles.button}>
                        <Button title="< Back" onPress={this.goBackHome} />
                    </View>
                )}

                <View
                    style={{ flexDirection: 'column', marginTop: Platform.OS == 'ios' ? 10 : 50, alignItems: 'center' }}
                >
                    <Text style={{ fontSize: 25, marginLeft: 20, fontWeight: 'bold' }}>Num Of Player</Text>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <TouchableOpacity onPress={this.increaseNumberPlayer} style={styles.numPlayerButton}>
                            <Text style={{ fontSize: 30 }}>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.decreaseNumberPlayer}
                            style={[styles.numPlayerButton, { marginLeft: 10 }]}
                        >
                            <Text style={{ fontSize: 30 }}>-</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.editDetailComponent()}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flex: 1
    },
    viewContainer: {
        backgroundColor: '#44D362',
        height: 100,
        flexDirection: 'row'
    },
    hole0: {
        marginBottom: 5,
        marginTop: 10,
        padding: 6,
        fontWeight: 'bold',
        fontSize: 30,
        borderRadius: 2,
        width: 160,
        textAlign: 'center',
        alignItems: 'center'
    },
    parhcp: {
        marginLeft: 10,
        marginBottom: 5,
        marginTop: 10,
        borderWidth: 1,
        padding: 6,
        backgroundColor: '#ffffff',
        fontSize: 20,
        borderRadius: 2,
        textAlign: 'center'
    },
    title: {
        marginTop: 10,
        fontSize: 30
    },
    holesNum: {
        marginTop: 10,
        fontSize: 20
    },
    button: {
        alignItems: 'flex-start',
        marginLeft: 10,
        marginTop: 30
    },
    buttonView: {
        borderRadius: 40,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#44D362',
        marginTop: 30,
        width: 150,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 20,
        color: '#FFFFFF'
    },
    editDetailContainer: {
        marginTop: 30,
        alignItems: 'center'
    },
    numPlayerButton: {
        borderWidth: 1,
        width: 40,
        height: 40,
        borderColor: 'blue',
        borderRadius: 4,
        alignItems: 'center'
    }
})

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(ManualScoreScreen)
