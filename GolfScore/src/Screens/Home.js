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

import { StyleSheet, ActivityIndicator, View, Text, ScrollView, FlatList, Image, TouchableOpacity } from 'react-native'
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
            showIndicator: false
        }
    }

    onPressScanButton = () => {
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

    onPressManualButton = () => {
        //goTo ScoreView
        Actions.ScoreView({
            texts: [
                ['P1', '1', '2', '3', '4', '4', '3', '5', '4', '4'],
                ['P2', '4', '2', '3', '4', '3', '4', '4', '3', '5'],
                ['P3', '1', '3', '3', '4', '5', '6', '4', '5', '3']
            ]
        })
    }

    gotoSearchScreen = () => {
        Actions.SearchScreen()
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ marginTop: 50, alignItems: 'center' }}>
                    <Text style={{ fontSize: 50, fontFamily: 'Avenir Next' }}>Golf Score</Text>
                    <Text style={{ fontSize: 50, fontFamily: 'Avenir Next' }}>Reader</Text>
                </View>
                <View style={styles.courseView}>
                    <Text style={styles.courseDetailText}>{this.props.courseName}</Text>
                    <Text style={styles.courseDetailText}> Golf Course</Text>
                    <View style={{ marginTop: 40 }}>
                        <TouchableOpacity onPress={this.gotoSearchScreen}>
                            <Text
                                style={{
                                    fontSize: 30,
                                    color: '#0000FF',
                                    fontFamily: 'Avenir Next'
                                }}
                            >
                                Change Golf Course
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.buttonView}>
                    <CustomButton title="Manually" onPress={() => Actions.ManualScore()} />
                    <CustomButton title="Scan" onPress={this.onPressManualButton} />
                </View>
                <View style={styles.indicatorView}>
                    {this.state.showIndicator && (
                        <View style={styles.indicatorContainer}>
                            <ActivityIndicator size="large" color="#FFFFFF" animating={this.state.showIndicator} style={{ justifyContent: 'center' }} />
                        </View>
                    )}
                </View>
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
        backgroundColor: '#FFFFFF',
        alignItems: 'center'
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
        marginTop: 20,
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
        opacity: 0.8
    },
    image: {
        height: 300,
        width: 250
    },

    indicatorView: {
        flex: 1,
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        top: 10,
        alignItems: 'center'
    },
    courseView: {
        alignItems: 'center',
        marginTop: 30,
        padding: 20,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15
    },
    courseDetailText: {
        marginTop: 5,
        fontSize: 40,
        color: '#000000',
        fontFamily: 'Avenir Next',
        textAlign: 'center'
    }
})

const mapStateToProps = state => ({
    courseName: state.courseName
})

export default connect(mapStateToProps)(Home)
