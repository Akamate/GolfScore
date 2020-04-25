import React, { Component } from 'react'
import ImagePicker from 'react-native-image-picker'
import { Actions } from 'react-native-router-flux'
import googleAPI from '../api/googleApi'
import { SafeAreaView, StyleSheet, ActivityIndicator, View, Text, TextInput, Button, ScrollView, FlatList, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux'
import { Icon } from 'native-base'
import ScoreLists from '../Components/ScoreLists'
import CustomButton from '../Components/CustomButton'
const options = {
    title: 'Select Avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    },
    quality: 0.4,
    tintColor: '#000000'
}

class ScoreView extends Component {
    //holes -> [0 ,1,2,3,4,5,6,7,8,9, 10 , 11]
    //          title                  total deleteIcon
    //score
    constructor(props) {
        super(props)
        this.state = {
            score: this.props.texts,
            score1: [''],
            showIndicator: false,
            isComplete: false,
            holes: [],
            hole: 0,
            isEditing: false
        }
    }
    componentDidMount() {
        this.findTotalScore()
        this.setState({
            holes: this.findHoles()
        })
    }

    findTotalScore = () => {
        const scores = [...this.state.score]
        scores.map((score, index) => {
            if (score.length > 9) {
                sum = 0
                for (i = 0; i < 9; i++) {
                    if (score[i] != '') sum += parseInt(score[i])
                }
                score[score.length - 1] = sum
            } else {
                score.push(score.reduce((a, b) => a + b, 0))
            }
        })

        this.setState({ score: scores })
    }

    findHoles() {
        var allHoles = []
        for (i = 0; i <= 11 + this.state.hole; i++) {
            allHoles.push(i)
        }
        return allHoles
    }

    onPressButton = () => {
        if (this.state.isComplete) {
            this.goCalculateScoreView(false)
        }
        // else {
        // TODO OPEN CAMERA OR GALLERORY

        this.setState(
            {
                isComplete: true,
                score1: this.state.score,
                hole: 9
            },
            () => {
                const data = [[5, 2, 3, 4, 4, 3, 5, 4, 4], [4, 2, 3, 4, 3, 4, 4, 3, 5], [1, 3, 3, 4, 5, 6, 4, 5, 3]]

                this.setState(
                    {
                        showIndicator: false,
                        score: data
                    },
                    () => {
                        this.findTotalScore()
                    }
                )
            }
        )
    }

    goCalculateScoreView = isOnePage => {
        if (isOnePage) {
            Actions.ScoreView2({
                score: this.state.score,
                holes: this.findHoles()
            })
        } else {
            if (this.state.score.length == this.state.score1.length) {
                var array = [...this.state.score1]
                const array1 = [...this.state.score]
                for (let i = 0; i < this.state.score.length; i++) {
                    array[i] = array[i].concat(array1[i])
                }

                this.setState({ score: array }, () => {
                    Actions.ScoreView2({
                        score: array,
                        holes: this.findHoles()
                    })
                })
            }
        }
    }

    callApi(data) {
        this.setState({
            showIndicator: true
        })
        googleAPI.postImage(data, (err, data) => {
            this.setState({
                score1: this.state.score
            })

            this.setState(
                {
                    showIndicator: false,
                    score: data
                },
                () => {
                    this.setState({ holes: this.findHoles() })
                }
            )
        })
    }

    removePlayer = key => {
        var filteredData = this.state.score.filter(item => item != this.state.score[key])
        this.setState({ score: filteredData })
    }

    onEditingScore = (text, index, holeNumber) => {
        const newArray = [...this.state.score]
        //console.log(newArray[index][holeNumber])
        newArray[index][holeNumber] = text != '' ? parseInt(text) : ''
        this.setState({ score: newArray }, () => {
            if (text != '') this.findTotalScore()
        })
    }

    render() {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.button}>
                    <Button
                        title="< Back"
                        onPress={() => {
                            Actions.reset('Home')
                        }}
                    />
                </View>
                <View style={styles.buttonRight}>
                    <Button
                        title={this.state.isEditing ? 'Confirm' : 'Edit'}
                        onPress={() => {
                            this.setState({ isEditing: !this.state.isEditing })
                        }}
                    />
                </View>
                <View style={{ backgroundColor: 'white', borderRadius: 0, marginTop: -5 }}>
                    <ScoreLists
                        holes={this.state.holes}
                        hole={this.state.hole}
                        par={this.props.par}
                        hcp={this.props.hcp}
                        scores={this.state.score}
                        onEditingScore={this.onEditingScore}
                        removeable={this.state.isEditing}
                        editable={this.state.isEditing}
                        removePlayer={this.removePlayer}
                        isComplete={false}
                    />
                    <View style={styles.buttonView}>
                        <CustomButton
                            title={this.state.isComplete ? 'Calculate Score' : 'Scan Next Page'}
                            disable={this.state.isEditing}
                            onPress={this.onPressButton}
                        />
                        {!this.state.isComplete && (
                            <CustomButton title={'Calculate Score'} disable={this.state.isEditing} onPress={this.goCalculateScoreView} />
                        )}
                    </View>
                </View>

                <View style={styles.indicatorView}>
                    {this.state.showIndicator && (
                        <View style={styles.indicatorContainer}>
                            <ActivityIndicator size="large" color="#FFFFFF" animating={this.state.showIndicator} style={{ justifyContent: 'center' }} />
                        </View>
                    )}
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
        borderColor: 'black',
        paddingLeft: 20,
        margin: 10,
        borderRadius: 20,
        fontSize: 30,
        color: 'black',
        backgroundColor: 'white'
    },
    indicatorView: {
        flex: 1,
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        top: 10,
        alignItems: 'center'
    },
    buttonTouchable: {
        borderRadius: 30,
        borderWidth: 2,
        paddingHorizontal: 30,
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
        marginTop: 10,
        alignSelf: 'center',
        textAlign: 'center',
        justifyContent: 'center'
    },
    button: {
        alignItems: 'flex-start',
        marginTop: 30
    },
    buttonRight: {
        position: 'absolute',
        top: 30,
        right: 20
    },
    indicatorContainer: {
        position: 'absolute',
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: '#000000',
        opacity: 0.8
    }
})

const mapStateToProps = state => ({
    courseName: state.courseName,
    par: state.par,
    hcp: state.hcp
})

export default connect(mapStateToProps)(ScoreView)
