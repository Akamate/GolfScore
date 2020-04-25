/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component } from 'react'
//import ImagePicker from 'react-native-image-picker';
import { Actions } from 'react-native-router-flux'
import googleAPI from '../api/googleApi'
import { Icon } from 'native-base'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-crop-picker'
import CustomButton from '../Components/CustomButton'
import ActionSheet from 'react-native-actionsheet'
import Popup from '../Components/Popup'
import { StyleSheet, ActivityIndicator, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native'

const options = {
    title: 'Choose Avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    },
    quality: 0.6,
    tintColor: '#FFFFFF'
}

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showIndicator: false,
            isSelected: true
        }
    }

    showActionSheet = () => {
        if (this.props.courseName == null) {
            //this.setState({ isSelected: false })
            this.ActionSheet.show()
        } else {
            this.ActionSheet.show()
        }
    }

    onPressPicker = () => {
        //   Actions.ScoreView({texts: [['P1','1','2','3','4','4','3','5','4','4'],['P2','4','2','3','4','3','4','4','3','5'],['P3','1','3','3','4','5','6','4','5','3']]})
        //this.showImagePicker()

        ImagePicker.openPicker({
            height: 210,
            width: 500,
            cropping: true,
            includeBase64: true
        }).then(image => {
            this.setState({
                showIndicator: true
            })
            googleAPI.postImage(image.data, (err, data) => {
                console.log(data)
                Actions.ScoreView({ texts: data })
                this.setState({
                    showIndicator: false
                })
            })
        })
    }

    onPressCamera = () => {
        //   Actions.ScoreView({texts: [['P1','1','2','3','4','4','3','5','4','4'],['P2','4','2','3','4','3','4','4','3','5'],['P3','1','3','3','4','5','6','4','5','3']]})
        //this.showImagePicker()

        ImagePicker.openCamera({
            height: 210,
            width: 500,
            cropping: true,
            includeBase64: true
        }).then(image => {
            this.setState({
                showIndicator: true
            })
            googleAPI.postImage(image.data, (err, data) => {
                console.log(data)
                Actions.ScoreView({ texts: data })
                this.setState({
                    showIndicator: false
                })
            })
        })
    }

    onPressManualButton = () => {
        //goTo ScoreView
        // if (this.props.courseName == null) {
        //     this.setState({ isSelected: false })
        // } else {
        //      Actions.ManualScore()
        // }
        Actions.ScoreView({
            texts: [[1, 2, 3, 4, 4, 3, 5, 4, 4], [4, 2, 3, 4, 3, 4, 4, 3, 5], [1, 3, 3, 4, 5, 6, 4, 5, 3]]
        })
    }

    gotoSearchScreen = () => {
        Actions.SearchScreen()
    }

    render() {
        return (
            <View style={styles.container}>
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

                <Text style={{ fontFamily: 'Avenir Next', fontSize: 50, marginTop: 0, color: 'white', textAlign: 'center' }}>Golf Score</Text>
                <Text
                    style={{
                        fontFamily: 'Avenir Next',
                        fontSize: 50,
                        marginTop: 0,
                        marginBottom: 20,
                        color: 'white',
                        textAlign: 'center'
                    }}
                >
                    Reader
                </Text>

                <View style={styles.courseView}>
                    <Text style={{ fontSize: 30, marginBottom: 10, marginTop: 10, fontWeight: 'bold' }}>Golf Course</Text>
                    <TouchableOpacity onPress={this.gotoSearchScreen} style={{ backgroundColor: '#F2F2F7', padding: 20, borderRadius: 8 }}>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 25 }}>{this.props.courseName}</Text>
                        <Text style={styles.courseDetailText}> Golf Course</Text>
                        <Text
                            style={{
                                fontSize: 15,
                                color: 'grey',
                                textAlign: 'center',
                                marginTop: 5
                            }}
                        >
                            Tap to change golf course
                        </Text>
                    </TouchableOpacity>

                    <Text style={{ fontSize: 30, fontFamily: 'Avenir Next', fontWeight: 'bold', marginTop: 20 }}>Score</Text>

                    <TouchableOpacity onPress={() => Actions.ManualScore()} style={styles.scoreButton}>
                        <Text style={styles.scoreText}> Enter Manually </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onPressManualButton} style={styles.scoreButton}>
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
                        <ActivityIndicator size="large" color="#FFFFFF" animating={this.state.showIndicator} style={{ justifyContent: 'center' }} />
                    </View>
                )}
                {this.state.showIndicator && (
                    <View style={{ backgroundColor: 'rgba(0,0,0, 0.6)', position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }} />
                )}
            </View>
        )
    }

    // showImagePicker = () => {
    //     ImagePicker.showImagePicker(options, (response) => {
    //     if (response.didCancel) {
    //         console.log('User cancelled image picker');
    //     } else if (response.error) {
    //         console.log('ImagePicker Error: ', response.error);
    //     } else if (response.customButton) {
    //         console.log('User tapped custom button: ', response.customButton);
    //     } else {
    //         const source = { uri: response.uri };

    //         this.setState({
    //             image: response,
    //             showIndicator: true
    //         });
    // googleAPI.postImage(response.data,(err,data) => {
    //         console.log(data)
    //         this.setState({
    //           showIndicator: false
    //         })
    //         Actions.ScoreView({texts: data})
    //         })
    //    }
    //       });
    // }
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
        // alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 10,
        padding: 20,
        borderRadius: 30,
        backgroundColor: '#ffffff'
    },
    courseDetailText: {
        marginTop: 5,
        fontSize: 25,
        color: '#000000',
        //  fontFamily: 'Avenir Next',
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
    }
})

const mapStateToProps = state => ({
    courseName: state.courseName
})

export default connect(mapStateToProps)(Home)
