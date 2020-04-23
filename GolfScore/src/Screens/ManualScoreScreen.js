import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput, ScrollView } from 'react-native'
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
            numOfPlayer: 0
        }
    }

    componentDidMount() {
        this.setHoleArray()
        this.firstTextInput.focus()
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
            for (j = 0; j <= this.state.numOfHoles; j++) {
                if (j === 0) {
                    scores[i].push(`P${i + 1}`)
                }
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
        scores[index][holesNumber] = text
        this.setState({ scores: scores })
    }

    goBackHome() {
        Actions.reset('Home')
    }

    goToCalculateScore = () => {
        if (this.state.scores.length > 0) Actions.ScoreView2({ score: this.state.scores, holes: this.state.holes })
    }

    editDetailComponent = () => {
        return (
            <View style={{ marginTop: 30, alignItems: 'center' }}>
                <Text style={styles.hole0}>Hole {this.state.currentHole}</Text>
                {this.state.scores.map((score, index) => {
                    return (
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10, marginLeft: 5 }}>
                            <TextInput
                                style={{ marginLeft: 60, fontSize: 30, alignItems: 'center', borderBottomWidth: 1 }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder={'P' + (index + 1)}
                                value={score[this.state.currentHole]}
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
                            <Text style={{ fontSize: 30, position: 'absolute', marginLeft: 0 }}>{'P' + (index + 1)} </Text>
                        </View>
                    )
                })}

                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => this.setState({ currentHole: this.state.currentHole >= 2 ? this.state.currentHole - 1 : 1 })}
                        style={styles.buttonView}
                    >
                        <Text style={styles.buttonText}> Previous </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ currentHole: this.state.currentHole + 1 })} style={styles.buttonView}>
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
                <View style={{ backgroundColor: '#44D362', height: 100, flexDirection: 'row' }}>
                    <View style={styles.button}>
                        <Button title="< Back" onPress={this.goBackHome} />
                    </View>
                    <Text style={{ textAlign: 'center', fontSize: 30, color: 'white', marginTop: 50, marginLeft: 10 }}>Manually Score</Text>
                </View>
                <View style={{ flexDirection: 'column', marginTop: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 30, marginLeft: 20, fontWeight: 'bold' }}>Num Of Player</Text>
                    <TextInput
                        ref={input => {
                            this.firstTextInput = input
                        }}
                        style={{ fontSize: 30, marginLeft: 20, width: 190, borderBottomWidth: 1, marginTop: 10, textAlign: 'center' }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Num Of Player"
                        value={this.state.numOfPlayer}
                        onChangeText={text => this.changeNumOfPlayer(text)}
                        keyboardType="number-pad"
                        maxLength={1}
                        returnKeyType={'done'}
                    />
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
    hole0: {
        marginBottom: 5,
        marginTop: 10,
        padding: 6,
        // backgroundColor: '#323232',
        fontWeight: 'bold',
        fontSize: 30,
        borderRadius: 2,
        width: 160,
        textAlign: 'center',
        //  color: '#FFFFFF',
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
    }
})

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(ManualScoreScreen)
