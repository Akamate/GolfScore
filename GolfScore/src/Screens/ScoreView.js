import React, { Component } from 'react'
import { Actions } from 'react-native-router-flux'
import googleAPI from '../api/googleApi'
import {
    StyleSheet,
    ActivityIndicator,
    View,
    ScrollView,
    Text,
    Dimensions,
    Platform,
    TouchableOpacity
} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import ActionSheet from 'react-native-actionsheet'
import RNFS from 'react-native-fs'
import CameraRoll from '@react-native-community/cameraroll'
import { connect } from 'react-redux'
import ScoreLists from '../Components/ScoreLists'
import CustomButton from '../Components/CustomButton'
import ImageFilter from '../ImageFilter'
import EditScorePopup from '../Components/EditScorePopup'
class ScoreView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            score: this.props.texts,
            score1: [''],
            showIndicator: false,
            isComplete: false,
            holes: [],
            hole: 0,
            isEditing: false,
            imageUri: '',
            numberPlayer: this.props.numberPlayer,
            isShowPopup: false,
            scoreAtEdit: '',
            holeAtEdit: 0,
            indexAtEdit: 0
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
                sum = 0
                for (i = 0; i < 9; i++) {
                    if (score[i] != '' && !isNaN(score[i])) sum += parseInt(score[i])
                }
                score.push(sum)
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
        } else {
            // TODO OPEN CAMERA OR GALLERORY

            // this.setState(
            //     {
            //         score1: this.state.score,
            //         hole: 9
            //     },
            //     () => {
            // const data = [[6, 5, 4, 5, 6, 6, 2, 5, 5]]

            // this.setState(
            //     {
            //         showIndicator: false,
            //         score: data
            //     },
            //     () => {
            //         this.findTotalScore()
            //     }
            // )
            this.ActionSheet.show()
        }
    }

    goCalculateScoreView = isOnePage => {
        if (isOnePage) {
            Actions.CalculateScoreScreen({
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
                console.log(array)
                this.setState({ score: array }, () => {
                    Actions.CalculateScoreScreen({
                        score: array,
                        holes: this.findHoles()
                    })
                })
            }
        }
    }

    showActionSheet = () => {
        this.ActionSheet.show()
    }

    calculateHeight = () => {
        if (this.state.numberPlayer >= 4) {
            return this.state.numberPlayer * 92
        } else if (this.state.numberPlayer == 1) {
            return 120
        } else {
            return this.state.numberPlayer * 120 - 14 * this.state.numberPlayer
        }
    }
    onPressPicker = () => {
        var height = this.calculateHeight()
        ImagePicker.openPicker({
            height: height,
            width: 1000,
            cropping: true
        }).then(image => {
            this.setState({
                showIndicator: true,
                imageUri: image.path
            })
        })
    }

    onPressCamera = () => {
        var height = this.calculateHeight()
        ImagePicker.openCamera({
            height: height,
            width: 1000,
            cropping: true
        }).then(image => {
            this.setState({
                showIndicator: true,
                imageUri: image.path
            })
        })
    }

    base64 = async uri => {
        var data = await RNFS.readFile(`file://${uri}`, 'base64').then(res => {
            return res
        })
        this.setState({ imageUri: '' })
        CameraRoll.saveToCameraRoll(uri, 'photo')
        googleAPI.postImage(data, this.state.isSinglePlayer, (err, data) => {
            this.setState({
                showIndicator: false,
                imageUri: ''
            })
            if (data.length != 0) {
                this.setState({ score1: this.state.score, hole: 9 }, () => {
                    this.setState({ score: data, isComplete: true }, () => {
                        this.findTotalScore()
                    })
                })
            }
        })
    }

    removePlayer = key => {
        var filteredData = this.state.score.filter(item => item != this.state.score[key])
        this.setState({ score: filteredData })
    }

    onShowPopup = (index, holeNumber) => {
        this.setState({
            scoreAtEdit: this.state.score[index][holeNumber].toString(),
            holeAtEdit: holeNumber + this.state.hole,
            isShowPopup: true,
            indexAtEdit: index
        })
    }

    onEditingScore = text => {
        const newArray = [...this.state.score]
        this.setState({ scoreAtEdit: text })
        newArray[this.state.indexAtEdit][this.state.holeAtEdit - this.state.hole] = text != '' ? parseInt(text) : '' //tomorrow
        this.setState({ score: newArray }, () => {
            if (text != '') this.findTotalScore()
        })
    }
    onClosePopup = () => {
        this.setState({ isShowPopup: false })
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    scrollEnabled={!this.state.isShowPopup}
                >
                    {this.state.imageUri != '' && <ImageFilter uri={this.state.imageUri} callback={this.base64} />}
                    {Platform.OS === 'ios' && (
                        <View
                            style={[
                                styles.button,
                                { zIndex: this.state.isShowPopup || this.state.showIndicator ? 0 : 2 }
                            ]}
                        >
                            <TouchableOpacity
                                style={{ marginBottom: 0 }}
                                onPress={() => {
                                    Actions.reset('Home')
                                }}
                            >
                                <Text style={{ fontSize: 20, color: 'blue' }}>{'< Back'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View
                        style={[
                            styles.buttonRight,
                            {
                                marginTop: Platform.OS === 'ios' ? -40 : 30,
                                position: 'relative',
                                top: 0,
                                alignItems: 'flex-end'
                            }
                        ]}
                    >
                        <TouchableOpacity
                            style={{ marginBottom: 10, marginTop: -5 }}
                            onPress={() => {
                                this.setState({ isEditing: !this.state.isEditing })
                            }}
                        >
                            <Text style={{ fontSize: 20, color: 'blue' }}>
                                {this.state.isEditing ? 'Confirm' : 'Edit'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: 'white', borderRadius: 0, marginTop: -5 }}>
                        <ScoreLists
                            holes={this.state.holes}
                            hole={this.state.hole}
                            par={this.props.par}
                            hcp={this.props.hcp}
                            scores={this.state.score}
                            onEditingScore={this.onShowPopup}
                            editable={this.state.isEditing}
                            removeable={this.state.isEditing}
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
                                <CustomButton
                                    title={'Calculate Score'}
                                    disable={this.state.isEditing}
                                    onPress={this.goCalculateScoreView}
                                />
                            )}
                        </View>
                    </View>

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
                    {this.state.showIndicator && <View style={styles.modalView} />}
                    <ActionSheet
                        ref={o => (this.ActionSheet = o)}
                        title={'Please Choose'}
                        options={['Open Camera', 'Open Photo Gallery', 'Cancel']}
                        cancelButtonIndex={2}
                        onPress={index => {
                            if (index === 0) this.onPressCamera()
                            else if (index === 1) this.onPressPicker()
                        }}
                    />
                    {this.state.isShowPopup && (
                        <EditScorePopup
                            holeNumber={this.state.holeAtEdit}
                            score={this.state.scoreAtEdit}
                            onClosePopup={this.onClosePopup}
                            indexAtEdit={this.state.indexAtEdit}
                            onEditing={this.onEditingScore}
                        />
                    )}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#ffffff'
    },
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
        marginTop: 40,
        backgroundColor: '#ffffff',
        zIndex: 2,
        width: 100,
        marginBottom: 20,
        marginLeft: 20
    },
    buttonRight: {
        position: 'absolute',
        marginRight: 20
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
        opacity: 0.8,
        left: Dimensions.get('window').width / 2 - 50,
        zIndex: 5
    },
    modalView: {
        backgroundColor: 'rgba(0,0,0, 0.6)',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    }
})

const mapStateToProps = state => ({
    courseName: state.courseName,
    par: state.par,
    hcp: state.hcp
})

export default connect(mapStateToProps)(ScoreView)
