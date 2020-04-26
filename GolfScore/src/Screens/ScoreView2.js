import React, { Component } from 'react'
import { Actions } from 'react-native-router-flux'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native'
import CustomButton from '../Components/CustomButton'
import ScoreLists from '../Components/ScoreLists'
import { connect } from 'react-redux'
import Share from 'react-native-share'
import { system36Hcp, stableFord, doublePeoria, modifiedPeoria } from '../CalculateMethod'
var RNFS = require('react-native-fs')
const shareOptions = {
    title: 'Share via',
    message: 'some message',
    url: 'some share url',
    filename: 'test' // only for base64 file in Android
}

class ScoreView2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            score: this.props.score,
            holes: [],
            total: [],
            isPageOne: true
        }
    }

    componentDidMount() {
        this.findHoles()
        this.findGrossScore()
        // this.setState({ score: this.props.score }, () => {

        //    // this.calculateScore()
        // })
    }

    findHoles = () => {
        const holes = []
        let hole = 0
        for (i = 0; i <= 20; i++) {
            if (!isNaN(this.props.score[0][i]) && this.props.score[0][i] != '') {
                hole += 1
            }
        }
        for (i = 0; i <= hole; i++) {
            holes.push(i)
        }
        this.setState({ holes: holes })
    }

    findGrossScore = () => {
        const scores = [...this.props.score]
        scores.map((score, index) => {
            if (score.length < 11) {
                //scores.push(score[10])
            } else {
                score.push(score[9] + score[19])
            }
        })
        this.setState({ score: scores }, () => {
            this.calculateScore()
        })
    }

    onChangeText(text, key) {
        const newArray = [...this.state.score]
        newArray[key] = text
        this.setState({ score: newArray })
    }
    goBacktoHomeView() {
        Actions.reset('Home')
    }

    totalScore = () => {
        var scores = []
        for (var i = 0; i < this.state.score.length; i++) {
            var score = 0
            for (var j = 1; j < this.state.score[i].length; j++) {
                if (!isNaN(this.state.score[i][j]) && this.state.score[i][j] != '') score += parseInt(this.state.score[i][j])
            }
            scores.push(score)
        }
        return scores
    }

    calculateScore = () => {
        // var hcps = []
        // var scores = this.totalScore()
        // for (j = 0; j < this.state.score.length; j++) {
        //     var hcp = 0
        //     for (i = 0; i < this.state.score.length; i++) {
        //         if (this.props.par[i] - parseInt(this.state.score[j][i + 1]) == 1) {
        //             hcp += 1
        //         } else if (this.props.par[i] - parseInt(this.state.score[j][i + 1]) > 1) {
        //             hcp += 2
        //         }
        //     }
        //     hcps.push(hcp)
        // }
        // for (i = 0; i < scores.length; i++) scores[i] = scores[i] - hcps[i]
        // this.setState({ total: scores })
        // User Can Choose Methods
        // find h/c on stable ford
        //if(this.props.method == "System 36 Handicap")
        const scores = modifiedPeoria(this.state.score, this.props.par, [3, 4, 6, 12, 13, 15])
        console.log(scores)
        this.setState({ score: scores })
    }

    calculateColor = (score, index) => {
        if (score < this.props.par[index - 1]) {
            return '#0000FF'
        } else if (score > this.props.par[index - 1]) {
            return '#FF0000'
        } else return '#000000'
    }

    exportCSV = () => {
        var path = RNFS.DocumentDirectoryPath + '/test.csv'
        var row0 = 'Hole,'
        var par = 'PAR,'
        var hcp = 'HCP,'
        if (this.state.score[0].length > 12) {
            row0 = 'Hole,1,2,3,4,5,6,7,8,9,IN,10,11,12,13,14,15,16,17,18,OUT,TOT,H/C,NET\n'
            for (i = 0; i < this.props.par.length; i++) {
                par += `${this.props.par[i]},`
                hcp += i == 9 ? '  ,' : i < 9 ? `${this.props.hcp[i]},` : i < 19 ? `${this.props.hcp[i - 1]},` : ''
            }
        } else {
            row0 = 'Hole,1,2,3,4,5,6,7,8,9,IN,H/C,NET\n'
            for (i = 0; i < 10; i++) {
                par += `${this.props.par[i]},`
                hcp += i < 9 ? `${this.props.hcp[i]},` : ' '
            }
        }
        scores = ''
        for (i = 0; i < this.state.score.length; i++) {
            scores += `P${i + 1},`
            for (j = 0; j < this.state.score[i].length; j++) {
                if (this.state.score[i][j] != '') {
                    scores += `${this.state.score[i][j]},`
                }
            }
            scores += '\n'
        }
        par += '\n'
        hcp += '\n'

        // write the file
        RNFS.writeFile(path, row0 + scores + par + hcp, 'utf8')
            .then(success => {
                console.log('FILE WRITTEN!')
                options = Platform.select({
                    ios: {
                        activityItemSources: [
                            {
                                placeholderItem: { type: 'url', content: `file://${path}` },
                                item: {
                                    default: { type: 'url', content: `file://${path}` }
                                },
                                subject: {
                                    default: 'title',
                                    airDrop: 'AirDrop'
                                }
                            }
                        ]
                    }
                })
                Share.open(options)
                    .then(res => {
                        console.log(res)
                    })
                    .catch(err => {
                        err && console.log(err)
                    })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    render() {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ marginTop: 50 }} />
                <ScoreLists
                    holes={this.state.holes}
                    par={this.props.par}
                    hcp={this.props.hcp}
                    scores={this.state.score}
                    isComplete={true}
                    isPageOne={this.state.isPageOne}
                />
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    {this.state.total.map((score, index) => (
                        <Text style={{ fontSize: 20, fontWeight: 'bold', alignItems: 'center' }}>
                            {' '}
                            P{index + 1} {score} Points
                        </Text>
                    ))}
                </View>
                <View style={styles.buttonView}>
                    {this.state.score[0].length > 13 && (
                        <CustomButton
                            title={this.state.isPageOne ? 'Next >' : '< Previous'}
                            onPress={() => this.setState({ isPageOne: !this.state.isPageOne })}
                        />
                    )}
                    <CustomButton title="Export as CSV" onPress={this.exportCSV} />
                    <CustomButton title="BACK HOME" onPress={() => Actions.reset('Home')} />
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    textInputView: {
        width: '100%',
        backgroundColor: 'white'
    },
    textInput: {
        height: 40,
        borderWidth: 1,
        borderColor: 'white',
        paddingLeft: 20,
        margin: 10,
        borderRadius: 20,
        fontSize: 20,
        color: 'black',
        backgroundColor: 'grey'
    },

    buttonTouchable: {
        borderRadius: 30,
        borderWidth: 2,
        paddingHorizontal: 50,
        paddingVertical: 10,
        backgroundColor: '#000000',
        marginBottom: 20
    },
    buttonText: {
        fontSize: 20,
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: 'Avenir Next'
    },
    buttonView: {
        marginTop: 0,
        alignSelf: 'center',
        textAlign: 'center',
        justifyContent: 'center'
    }
})

const mapStateToProps = state => ({
    courseName: state.courseName,
    par: state.par,
    hcp: state.hcp
})

export default connect(
    mapStateToProps,
    null
)(ScoreView2)
