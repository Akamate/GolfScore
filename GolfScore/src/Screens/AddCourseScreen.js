import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput, Platform, ScrollView } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { setCourseName, setPar, setHcp } from '../reducer/actions'
import db from '../api/config'
import Popup from '../Components/Popup'
import CustomButton from '../Components/CustomButton'
import ParHcpLists from '../Components/ParHcpList'
class AddCourseScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            par: [],
            hcp: [],
            holes: [],
            numOfHoles: 18,
            courseName: '',
            currentHole: 1,
            isSuccess: false,
            isConnected: true,
            isComplete: false,
            isDisabledButton: true
        }
    }

    componentDidMount() {
        this.initialHoleArray()
        this.CheckConnectivity()
    }

    initialHoleArray = () => {
        var allHoles = []
        for (i = 0; i < this.state.numOfHoles; i++) {
            allHoles.push({ key: i, holesNumber: i })
        }
        this.setState({ holes: allHoles }, () => {
            this.initialParHcp()
        })
    }

    CheckConnectivity = () => {
        NetInfo.fetch().then(state => {
            this.setState({ isConnected: state.isConnected })
        })
    }

    onChangeCourseName = text => {
        this.setState({ courseName: text })
    }

    initialParHcp() {
        const par = []
        const hcp = []
        for (i = 0; i <= this.state.numOfHoles; i++) {
            par.push('')
            hcp.push('')
        }
        this.setState({
            par: par,
            hcp: hcp
        })
    }

    editPar = (text, holesNumber) => {
        const par = [...this.state.par]
        par[holesNumber] = text
        this.setState({ par: par })
        this.setState({ isDisabledButton: text == '' || this.state.hcp[holesNumber] == '' ? true : false })
    }

    editHcp = (text, holesNumber) => {
        const hcp = [...this.state.hcp]
        hcp[holesNumber] = text
        this.setState({ hcp: hcp })
        this.setState({ isDisabledButton: text == '' || this.state.par[holesNumber] == '' ? true : false })
    }

    goBackHome = () => {
        console.log('fdsfdsds')
        const courseName = this.state.courseName
        const par = this.state.par
        const hcp = this.state.hcp

        if (courseName != '') {
            db.ref('/courseLists')
                .push({
                    courseName,
                    par,
                    hcp
                })
                .then(data => {
                    this.props.setCourseName(courseName)
                    this.props.setPar(par)
                    this.props.setHcp(hcp)
                    this.setState({
                        isSuccess: true
                    })
                    //Actions.reset('Home')
                })
                .catch(error => {
                    console.log('error ', error)
                })
        }
    }

    goSearchScreen() {
        Actions.pop()
    }

    goHome = () => {
        Actions.reset('Home')
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {this.state.isSuccess && (
                    <Popup
                        type="Success"
                        title="Add Course complete"
                        button={true}
                        textBody="Congrats! Your course successfully added"
                        buttontext="GO HOME"
                        callback={this.goHome}
                    />
                )}
                {!this.state.isConnected && (
                    <Popup
                        type="Danger"
                        title="Network Error"
                        button={true}
                        textBody="Please Check Your Network Connection"
                        buttontext="GO BACK"
                        callback={this.goSearchScreen}
                    />
                )}

                <View style={styles.button}>
                    <Button title="< Back" onPress={this.goSearchScreen} />
                </View>

                <View style={styles.textInput}>
                    <TextInput
                        style={{ borderBottomWidth: 1, marginTop: 20, fontSize: 30, alignItems: 'center' }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Name Golf Course"
                        value={this.state.courseName}
                        onChangeText={text => this.onChangeCourseName(text)}
                        onEndEditing={this.onEndEditing}
                    />
                </View>
                {this.state.isComplete ? this.parhcpList() : this.editDetailComponent()}
            </ScrollView>
        )
    }

    parhcpList = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <ParHcpLists par={this.state.par} hcp={this.state.hcp} />
                <CustomButton title="SAVE COURSE" onPress={this.goBackHome} disable={!this.state.isComplete} />
            </View>
        )
    }

    editDetailComponent = () => {
        isDisabledOKButton = this.state.courseName.length < 5 || this.state.par[0] == '' || this.state.hcp[0] == ''
        return (
            <View style={{ alignItems: 'center', marginTop: 30 }}>
                <Text style={styles.hole0}>Hole {this.state.currentHole}</Text>
                <TextInput
                    style={{ borderBottomWidth: 1, marginTop: 20, fontSize: 30, alignItems: 'center' }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Par"
                    value={this.state.par[this.state.currentHole - 1]}
                    onChangeText={text => this.editPar(text, this.state.currentHole - 1)}
                    onEndEditing={this.onEndEditing}
                    keyboardType="number-pad"
                    maxLength={1}
                />
                <TextInput
                    style={{ borderBottomWidth: 1, marginTop: 20, fontSize: 30, alignItems: 'center' }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Hcp"
                    value={this.state.hcp[this.state.currentHole - 1]}
                    onChangeText={text => this.editHcp(text, this.state.currentHole - 1)}
                    onEndEditing={this.onEndEditing}
                    keyboardType="number-pad"
                    maxLength={2}
                />
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() =>
                            this.setState({ currentHole: this.state.currentHole >= 2 ? this.state.currentHole - 1 : 1 })
                        }
                        style={styles.buttonView}
                    >
                        <Text style={styles.changeHole}> Previous </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            this.setState({
                                currentHole: this.state.currentHole <= 17 ? this.state.currentHole + 1 : 18
                            })
                        }
                        style={[
                            styles.buttonView,
                            { backgroundColor: this.state.isDisabledButton ? '#323232' : '#44D362' }
                        ]}
                        disabled={this.state.isDisabledButton}
                    >
                        <Text style={styles.changeHole}> Next </Text>
                    </TouchableOpacity>
                </View>
                {!this.state.isComplete && (
                    <TouchableOpacity
                        onPress={() => this.setState({ isComplete: true })}
                        style={[styles.buttonView, , { backgroundColor: isDisabledOKButton ? '#323232' : '#44D362' }]}
                        disabled={isDisabledOKButton}
                    >
                        <Text style={styles.changeHole}> OK </Text>
                    </TouchableOpacity>
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flex: 1
    },
    hole: {
        marginBottom: 5,
        marginTop: 10,
        padding: 6,
        backgroundColor: '#44D362',
        fontWeight: 'bold',
        fontSize: 20,
        borderRadius: 2,
        width: 50,
        textAlign: 'center',
        color: '#ffffff'
    },

    hole0: {
        marginBottom: 5,
        marginTop: 10,
        padding: 6,
        backgroundColor: '#44D362',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 20,
        width: 100,
        textAlign: 'center',
        overflow: 'hidden'
    },

    parhcp: {
        marginLeft: 10,
        marginBottom: 5,
        marginTop: 10,
        borderWidth: 1,
        padding: 6,
        backgroundColor: '#ffffff',
        fontSize: 20,
        borderRadius: 2,
        textAlign: 'center'
    },

    parhcp0: {
        marginBottom: 5,
        marginTop: 10,
        width: 60,
        padding: 6,
        backgroundColor: '#ffffff',
        fontWeight: 'bold',
        fontSize: 20,
        borderRadius: 2,
        textAlign: 'center'
    },
    confirmButton: {
        fontSize: 30,
        color: '#FFFFFF'
    },
    button: {
        alignItems: 'flex-start',
        marginLeft: 10,
        marginTop: 30
    },
    textInput: {
        alignItems: 'center',
        fontSize: 30
    },
    buttonView: {
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#44D362',
        marginTop: 50,
        width: 110,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center'
    },
    changeHole: {
        fontSize: 20,
        color: '#FFFFFF'
    }
})

const mapDispatchToProps = dispatch => ({
    setCourseName: courseName => dispatch(setCourseName(courseName)),
    setPar: par => dispatch(setPar(par)),
    setHcp: hcp => dispatch(setHcp(hcp))
})

export default connect(
    null,
    mapDispatchToProps
)(AddCourseScreen)
