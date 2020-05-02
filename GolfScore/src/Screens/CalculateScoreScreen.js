import React, { Component } from 'react'
import { Actions } from 'react-native-router-flux'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import CustomButton from '../Components/CustomButton'
import ScoreLists from '../Components/ScoreLists'
import { connect } from 'react-redux'
import Share from 'react-native-share'
import { system36Hcp, stableFord, doublePeoria, modifiedPeoria, strokePlay } from '../CalculateMethod'
import MethodPopup from '../Components/MethodPopup'
import ExportPopup from '../Components/ExportPopup'
import { PlayerSchema } from '../model/player'
var RNFS = require('react-native-fs')
const Realm = require('realm')
class CalculateScoreScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            score: this.props.score,
            holes: [],
            isPageOne: true,
            isShowPopup: false,
            isShowExportPopup: false,
            playerName: '',
            allPlayer: [],
            isButtonDisable: false
        }
    }

    componentDidMount(props) {
        arr = []
        this.props.score.map(score => {
            console.log(score)
            // arr.push(score.match(/\d+(?:\.\d+)?/g).map(Number))
        })
        this.setState({ score: this.props.score }, () => {
            this.findHoles()
            this.findGrossScore()
            Realm.open({ schema: [PlayerSchema] }).then(realm => {
                // Create Realm objects and write to local storage
                const players = realm
                    .objects('Player')
                    .filtered(
                        'date = $0 AND golfCourse = $1',
                        `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
                        this.props.courseName
                    )
                console.log(players)
                this.setState({ allPlayer: players })
                realm.close()
            })
        })
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
        scores.map(score => {
            if (score.length < 11) {
                //scores.push(score[10])
            } else {
                score.push(score[9] + score[19])
            }
        })
        this.setState({ score: scores }, () => {
            this.calculateScore('System 36 Handicap', null, null)
        })
    }

    onChangeText(text, key) {
        const newArray = [...this.state.score]
        newArray[key] = text
        this.setState({ score: newArray })
    }

    calculateScore = (methodName, hcp, holeLists) => {
        var scores
        if (methodName == 'System 36 Handicap') {
            scores = system36Hcp(this.state.score, this.props.par)
        } else if (methodName == 'Stroke Play') {
            scores = strokePlay(this.state.score, parseInt(hcp))
        } else if (methodName == 'Double Peoria') {
            scores = doublePeoria(this.state.score, holeLists)
        } else if (methodName == 'Stable Ford') {
            scores = stableFord(this.state.score, this.props.par, this.props.hcp)
        }

        this.setState({ score: scores })
    }

    onEndSelecting = (methodName, hcp, holeLists) => {
        console.log(methodName)
        console.log(holeLists)
        this.setState({ isShowPopup: false })
        this.calculateScore(methodName, hcp, holeLists)
    }

    onSavePlayer = () => {
        Realm.open({ schema: [PlayerSchema] }).then(realm => {
            // Create Realm objects and write to local storage
            realm.write(() => {
                const player = realm.create('Player', {
                    name: this.state.playerName,
                    golfCourse: this.props.courseName,
                    scores: this.state.score[0],
                    date: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
                })
            })

            realm.close()
        })
        Actions.reset('Home')
    }

    exportCSV = () => {
        this.onClosePopup()
        var name = `Player,${this.state.playerName}, ,\n`
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
        alltext = name + row0 + scores + par + hcp
        // write the file
        this.writeFile(alltext)
    }

    writeFile = alltext => {
        var path = RNFS.DocumentDirectoryPath + `/${this.state.playerName}.csv`
        RNFS.writeFile(path, alltext, 'utf8')
            .then(success => {
                console.log('FILE WRITTEN!')
                Share.open({ url: `file://${path}` })
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

    onClosePopup = () => {
        this.setState({ isShowPopup: false, isShowExportPopup: false })
    }

    onPressMultiple = () => {
        this.onClosePopup()
        Actions.Multiple()
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView scrollEnabled={!this.state.isShowPopup}>
                    <View style={{ flexDirection: 'row', marginTop: 50 }}>
                        <Text style={{ fontSize: 20, marginLeft: 10, marginRight: 10 }}>Player Name :</Text>
                        <TextInput
                            style={{ fontSize: 20 }}
                            value={this.state.playerName}
                            placeholder={'Player Name'}
                            onChangeText={text => this.setState({ playerName: text })}
                        />
                    </View>
                    <ScoreLists
                        par={this.props.par}
                        hcp={this.props.hcp}
                        scores={this.state.score}
                        isComplete={true}
                        isPageOne={this.state.isPageOne}
                    />

                    <View style={styles.buttonView}>
                        {this.state.score[0].length > 13 && (
                            <CustomButton
                                title={this.state.isPageOne ? 'Next >' : '< Previous'}
                                onPress={() => this.setState({ isPageOne: !this.state.isPageOne })}
                            />
                        )}
                        <CustomButton title="Select Method" onPress={() => this.setState({ isShowPopup: true })} />
                        <CustomButton title="Save" onPress={this.onSavePlayer} />
                        <CustomButton title="Export Score" onPress={() => this.setState({ isShowExportPopup: true })} />
                        <CustomButton title="BACK HOME" onPress={() => Actions.reset('Home')} />
                    </View>
                </ScrollView>
                {this.state.isShowPopup && (
                    <MethodPopup onEndSelecting={this.onEndSelecting} onClosePopup={this.onClosePopup} />
                )}
                {this.state.isShowExportPopup && (
                    <ExportPopup
                        onClosePopup={this.onClosePopup}
                        onPressSingle={this.exportCSV}
                        onPressMultiple={this.onPressMultiple}
                    />
                )}
            </View>
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
        textAlign: 'center'
    },
    buttonView: {
        marginTop: 0,
        alignItems: 'center',
        textAlign: 'center'
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
)(CalculateScoreScreen)
