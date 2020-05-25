import { Threshold, Brightness, Grayscale, Contrast, Normal } from 'react-native-image-filter-kit'
import { Image } from 'react-native'
import React, { Component } from 'react'
export default (imageScore = ({ uri, callback }) => {
    return (
        <Normal
            image={
                <Threshold
                    image={
                        <Grayscale
                            image={
                                <Brightness
                                    image={
                                        <Contrast
                                            image={
                                                <Image
                                                    source={{ uri: uri }}
                                                    style={{ width: '100%', height: '100%' }}
                                                    resizeMethod="scale"
                                                />
                                            }
                                            amount={2}
                                        />
                                    }
                                    amount={6}
                                />
                            }
                        />
                    }
                    amount={2}
                />
            }
            onExtractImage={({ nativeEvent }) =>
                // this.setState({ imageUri1: nativeEvent.uri }, () => {

                // })
                callback(nativeEvent.uri)
            }
            extractImageEnabled={true}
        />
    )
})
