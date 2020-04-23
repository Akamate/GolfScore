import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Dimensions, Alert } from 'react-native'

const WIDTH = Dimensions.get('screen').width
const HEIGHT = Dimensions.get('screen').height

class Popup extends Component {
    //  static popupInstance = new Popup()

    // static show = ({ ...config }) => {
    //     this.popupInstance.start(config)
    // }

    // static hide() {
    //     this.popupInstance.hidePopup()
    // }
    constructor(props) {
        super(props)
        this.state = {
            positionView: new Animated.Value(HEIGHT),
            opacity: new Animated.Value(0),
            positionPopup: new Animated.Value(HEIGHT),
            popupHeight: HEIGHT / 2,
            title: '',
            type: '',
            textBody: '',
            button: true,
            buttonText: 'Ok',
            callback: this.defaultCallback,
            background: 'rgba(0, 0, 0, 0.5)',
            timing: 0,
            autoClose: false
        }
    }
    componentDidMount() {
        this.start()
    }

    start({ ...config }) {
        this.setState({
            title: this.props.title,
            type: this.props.type,
            textBody: this.props.textBody,
            button: this.props.button || true,
            buttonText: this.props.buttonText || 'Ok',
            callback: this.state.callback !== undefined ? this.props.callback : this.defaultCallback,
            background: this.state.background || 'rgba(0, 0, 0, 0.5)',
            timing: this.props.timing,
            autoClose: this.props.autoClose || false
        })

        Animated.sequence([
            Animated.timing(this.state.positionView, {
                toValue: 0,
                duration: 100
            }),
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 300
            }),
            Animated.spring(this.state.positionPopup, {
                toValue: HEIGHT / 2 - this.state.popupHeight / 2,
                bounciness: 15,
                useNativeDriver: true
            })
        ]).start()

        if (this.props.autoClose && this.props.timing !== 0) {
            const duration = this.props.timing > 0 ? this.props.timing : 5000
            setTimeout(() => {
                this.hidePopup()
            }, duration)
        }
    }

    hidePopup = () => {
        Animated.sequence([
            Animated.timing(this.state.positionPopup, {
                toValue: HEIGHT,
                duration: 250,
                useNativeDriver: true
            }),
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 300
            }),
            Animated.timing(this.state.positionView, {
                toValue: HEIGHT,
                duration: 100
            })
        ]).start()
    }

    defaultCallback = () => {
        this.setState(
            {
                positionView: new Animated.Value(HEIGHT),
                opacity: new Animated.Value(0),
                positionPopup: new Animated.Value(HEIGHT),
                popupHeight: HEIGHT / 2
            },
            () => {
                this.hidePopup()
                if (this.props.callback != undefined) this.props.callback()
            }
        )
    }

    handleImage(type) {
        switch (type) {
            case 'Success':
                return require('../asset/Success.png')
            case 'Danger':
                return require('../asset/Error.png')
        }
    }

    render() {
        const { title, type, textBody, button, buttonText, callback, background } = this.state

        return (
            <Animated.View
                ref={c => (this._root = c)}
                style={[
                    styles.Container,
                    {
                        backgroundColor: background || 'transparent',
                        opacity: this.state.opacity,
                        transform: [{ translateY: this.state.positionView }]
                    }
                ]}
            >
                <Animated.View
                    onLayout={event => {
                        this.setState({ popupHeight: event.nativeEvent.layout.height })
                    }}
                    style={[
                        styles.Message,
                        {
                            transform: [{ translateY: this.state.positionPopup }]
                        }
                    ]}
                >
                    <View style={styles.Header} />
                    <Image source={this.handleImage(type)} resizeMode="contain" style={styles.Image} />
                    <View style={styles.Content}>
                        <Text style={styles.Title}>{title}</Text>
                        <Text style={styles.Desc}>{textBody}</Text>
                        {button && (
                            <TouchableOpacity style={[styles.Button, styles[type]]} onPress={this.defaultCallback}>
                                <Text style={styles.TextButton}>{buttonText}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </Animated.View>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        position: 'absolute',
        zIndex: 9,
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        top: 0,
        left: 0
    },
    Message: {
        top: 0,
        maxWidth: 300,
        width: 230,
        minHeight: 300,
        backgroundColor: '#fff',
        borderRadius: 30,
        alignItems: 'center',
        overflow: 'hidden',
        position: 'absolute'
    },
    Content: {
        padding: 20,
        alignItems: 'center'
    },
    Header: {
        height: 230,
        width: 230,
        backgroundColor: '#FBFBFB',
        borderRadius: 100,
        marginTop: -120
    },
    Image: {
        width: 150,
        height: 80,
        position: 'absolute',
        top: 20
    },
    Title: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#333'
    },
    Desc: {
        textAlign: 'center',
        color: '#666',
        marginTop: 10
    },
    Button: {
        borderRadius: 50,
        height: 40,
        width: 130,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    TextButton: {
        color: '#fff',
        fontWeight: 'bold'
    },
    Success: {
        backgroundColor: '#AAF577',
        shadowColor: '#AAF577',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11
    },
    Danger: {
        backgroundColor: '#F29091',
        shadowColor: '#F29091',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11
    },
    Warning: {
        backgroundColor: '#fbd10d',
        shadowColor: '#fbd10d',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11
    }
})

export default Popup
