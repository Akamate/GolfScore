/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component } from 'react'
import { Actions } from 'react-native-router-flux'
import googleAPI from '../api/googleApi'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-crop-picker'
import ActionSheet from 'react-native-actionsheet'
import Popup from '../Components/Popup'
import logo from './logo.png'
import RNFS from 'react-native-fs'
import {
    Threshold,
    Brightness,
    Grayscale,
    Invert,
    Sharpen,
    Contrast,
    LuminanceToAlpha,
    Normal,
    cleanExtractedImagesCache
} from 'react-native-image-filter-kit'
import { StyleSheet, ActivityIndicator, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showIndicator: false,
            isSelected: true,
            imageUri: '',
            imageUri1: '',
            imgWidth: 0,
            imageHeight: 0
        }
    }

    showActionSheet = () => {
        if (this.props.courseName == null) {
            // this.setState({ isSelected: false })
            this.ActionSheet.show()
        } else {
            this.ActionSheet.show()
        }
    }

    onPressPicker = () => {
        ImagePicker.openPicker({
            height: 230,
            width: 550,
            cropping: true,
            includeBase64: true
        }).then(image => {
            this.setState({
                showIndicator: true
                // imageUri: image.path
            })
            googleAPI.postImage(image.data, (err, data) => {
                console.log(data)
                //  Actions.ScoreView({ texts: data })
                this.setState({
                    showIndicator: false
                })
            })
        })
    }

    imageScore = () => {
        return (
            <Normal
                image={
                    <Normal
                        image={
                            <Brightness
                                image={
                                    <Normal
                                        image={
                                            <Image
                                                source={{ uri: this.state.imageUri }}
                                                style={{ width: '100%', height: '100%' }}
                                                resizeMode="stretch"
                                            />
                                        }
                                    />
                                }
                                amount={1.3}
                            />
                        }
                    />
                }
                onExtractImage={({ nativeEvent }) =>
                    this.setState({ imageUri1: nativeEvent.uri }, () => {
                        this.base64(nativeEvent.uri)
                    })
                }
                extractImageEnabled={true}
            />
        )
    }

    onPressCamera = () => {
        ImagePicker.openCamera({
            height: 160,
            width: Dimensions.get('window').width,
            cropping: true,
            includeBase64: true
        }).then(image => {
            console.log(image.width, image.height)
            this.setState(
                {
                    showIndicator: true,
                    imageUri: image.path
                },
                () => {}
            )
            // googleAPI.postImage(image.data, (err, data) => {
            //     console.log(data)
            //     Actions.ScoreView({ texts: data })
            //     this.setState({
            //         showIndicator: false,
            //         imageUri: ''
            //     })
            //})
        })
    }

    onPressManualButton = () => {
        Actions.ScoreView({
            texts: [
                [5, 5, 4, 5, 3, 5, 8, 3, 4],
                [4, 2, 3, 4, 3, 4, 4, 3, 5],
                [1, 3, 3, 4, 5, 6, 4, 5, 3],
                [5, 5, 4, 5, 3, 5, 8, 3, 4]
            ]
        })
    }

    gotoSearchScreen = () => {
        Actions.SearchScreen()
    }

    base64 = async uri => {
        var data = await RNFS.readFile(`file://${uri}`, 'base64').then(res => {
            return res
        })
        this.setState({ imageUri1: uri })
        googleAPI.postImage(data, (err, data) => {
            console.log(data)
            Actions.ScoreView({ texts: data })
            this.setState({
                showIndicator: false,
                imageUri: ''
            })
        })
    }
    render() {
        return (
            <View style={styles.container}>
                {this.state.imageUri != '' && this.imageScore()}
                {this.state.imageUri1 != '' && (
                    <Image style={{ width: 500, height: 210 }} source={{ uri: this.state.imageUri1 }} />
                )}
                {!this.state.isSelected && (
                    <Popup
                        type="Danger"
                        title="No Golf Course"
                        button={true}
                        textBody="Please Select Golf Course"
                        buttontext="OKAY"
                        callback={() => this.setState({ isSelected: true })}
                    />
                )}

                <Text style={styles.title}>Golf Score</Text>
                <Text style={[styles.title, { marginBottom: 20 }]}>Reader</Text>

                <View style={styles.courseView}>
                    <Text style={{ fontSize: 30, marginBottom: 10, marginTop: 10, fontWeight: 'bold' }}>
                        Golf Course
                    </Text>
                    <TouchableOpacity
                        onPress={this.gotoSearchScreen}
                        style={{ backgroundColor: '#F2F2F7', padding: 20, borderRadius: 8 }}
                    >
                        <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 25 }}>
                            {this.props.courseName}
                        </Text>
                        <Text style={styles.courseDetailText}> Golf Course</Text>
                        <Text style={styles.changeGolfCourse}>Tap to change golf course</Text>
                    </TouchableOpacity>

                    <Text style={{ fontSize: 30, fontWeight: 'bold', marginTop: 20 }}>Score</Text>

                    <TouchableOpacity onPress={() => Actions.ManualScore()} style={styles.scoreButton}>
                        <Text style={styles.scoreText}> Enter Manually </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.showActionSheet} style={styles.scoreButton}>
                        <Text style={styles.scoreText}> Scan Score Card </Text>
                    </TouchableOpacity>
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
        backgroundColor: '#44D362'
    },

    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 0
    },
    item: {
        backgroundColor: '#ffffff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16
    },
    text: {
        fontSize: 20,
        color: '#000000'
    },
    buttonView: {
        marginTop: 40,
        alignSelf: 'center',
        textAlign: 'center',
        justifyContent: 'center'
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
    popupContainer: {
        position: 'absolute',
        width: 300,
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        opacity: 1,
        zIndex: 5,
        alignSelf: 'center'
    },
    image: {
        height: 300,
        width: 250
    },

    indicatorView: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        position: 'absolute',
        alignItems: 'center',
        left: 150
    },
    courseView: {
        marginTop: -10,
        marginHorizontal: 10,
        padding: 20,
        borderRadius: 30,
        backgroundColor: '#ffffff'
    },
    courseDetailText: {
        marginTop: 5,
        fontSize: 25,
        color: '#000000',
        textAlign: 'center'
    },
    scoreText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    scoreButton: {
        backgroundColor: '#F2F2F7',
        padding: 20,
        borderRadius: 8,
        marginTop: 10
    },
    methodText: {
        marginTop: 5,
        fontSize: 25,
        color: '#000000',
        textAlign: 'center'
    },
    title: {
        fontSize: 50,
        marginTop: 0,
        color: 'white',
        textAlign: 'center'
    },
    modalView: {
        backgroundColor: 'rgba(0,0,0, 0.6)',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    },
    changeGolfCourse: {
        fontSize: 15,
        color: 'grey',
        textAlign: 'center',
        marginTop: 5
    }
})

const mapStateToProps = state => ({
    courseName: state.courseName
})

export default connect(mapStateToProps)(Home)
