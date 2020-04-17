import React, { Component } from 'react'
import ImagePicker from 'react-native-image-picker'
import { Actions } from 'react-native-router-flux'
import googleAPI from '../api/googleApi'
import {
    SafeAreaView,
    StyleSheet,
    ActivityIndicator,
    View,
    Text,
    TextInput,
    Button,
    ScrollView,
    FlatList,
    TouchableOpacity
} from 'react-native'

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
            hole: 0
        }
    }
    componentDidMount() {
        this.setState({
            holes: this.findHoles()
        })
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
            console.log('1231321')
        }
        // else {
        this.setState(
            {
                isComplete: true,
                score1: this.state.score,
                hole: 9
            },
            () => {
                const data = [
                    ['P1', '5', '2', '3', '4', '4', '3', '5', '4', '4'],
                    ['P2', '4', '2', '3', '4', '3', '4', '4', '3', '5'],
                    ['P3', '1', '3', '3', '4', '5', '6', '4', '5', '3']
                ]

                this.setState({
                    showIndicator: false,
                    score: data
                })
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
                    array[i] = array[i].concat(array1[i].splice(1))
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

    showImagePicker = () => {
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker')
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error)
            } else if (response.customButton) {
                console.log(
                    'User tapped custom button: ',
                    response.customButton
                )
            } else {
                const source = { uri: response.uri }

                this.callApi(response.data)
            }
        })
    }

    callApi(data) {
        this.setState({
            showIndicator: true
        })
        googleAPI.postImage(data, (err, data) => {
            console.log(data + '  page 2')

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
        var filteredData = this.state.score.filter(
            item => item != this.state.score[key]
        )
        for (i = 0; i < filteredData.length; i++) {
            filteredData[i].splice(0, 1)
            filteredData[i].splice(0, 0, `P${i + 1}`)
        }
        this.setState({ score: filteredData })
    }

    onEditingScore = (text, key, item) => {
        const newArray = [...this.state.score]
        newArray[key][item] = text
        this.setState({ score: newArray })
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
                <View style={{ backgroundColor: 'white' }}>
                    <ScoreLists
                        holes={this.state.holes}
                        hole={this.state.hole}
                        par={this.props.par}
                        hcp={this.props.hcp}
                        scores={this.state.score}
                        onEditingScore={this.onEditingScore}
                        removeable={true}
                        removePlayer={this.removePlayer}
                    />
                    <View style={styles.buttonView}>
                        <CustomButton
                            title={
                                this.state.isComplete
                                    ? 'Calculate Score'
                                    : 'Scan Next Page'
                            }
                            onPress={this.onPressButton}
                        />
                        {!this.state.isComplete && (
                            <CustomButton
                                title={'Calculate Score'}
                                onPress={this.goCalculateScoreView}
                            />
                        )}
                    </View>
                </View>
                <View style={styles.indicatorView}>
                    {this.state.showIndicator && (
                        <View style={styles.indicatorContainer}>
                            <ActivityIndicator
                                size="large"
                                color="#FFFFFF"
                                animating={this.state.showIndicator}
                                style={{ justifyContent: 'center' }}
                            />
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
        marginTop: 30,
        alignSelf: 'center',
        textAlign: 'center',
        justifyContent: 'center'
    },
    button: {
        alignItems: 'flex-start',
        marginLeft: 10,
        marginTop: 30
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
