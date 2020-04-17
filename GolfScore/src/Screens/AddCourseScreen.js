import React from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, TextInput } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { setCourseName, setPar, setHcp } from '../reducer/actions'
import db from '../api/config'

class AddCourseScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            par: [],
            hcp: [],
            holes: [],
            numOfHoles: 18,
            courseName: '',
            currentHole: 1
        }
    }

    componentDidMount() {
        this.setHoleArray()
    }

    setHoleArray = () => {
        var allHoles = []
        for (i = 0; i <= this.state.numOfHoles; i++) {
            allHoles.push({ key: i, holesNumber: i })
        }
        this.setState({ holes: allHoles }, () => {
            this.setParHcp()
        })
    }

    onChangeCourseName = text => {
        this.setState({ courseName: text })
    }

    onChangeNumOfHoles = numOfHoles => {
        this.setState({ numOfHoles: parseInt(numOfHoles) }, () => {
            this.setHoleArray()
        })
    }

    setParHcp() {
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
    }

    editHcp = (text, holesNumber) => {
        const hcp = [...this.state.hcp]
        hcp[holesNumber] = text
        this.setState({ hcp: hcp })
    }

    goBackHome() {
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
                    this.props.setCourseName(this.state.courseName)
                    this.props.setPar(this.state.par)
                    this.props.setHcp(this.state.hcp)
                    Actions.reset('HOME')
                })
                .catch(error => {
                    console.log('error ', error)
                })
        }
    }

    goSearchScreen() {
        Actions.pop()
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.button}>
                    <Button
                        title="< Back"
                        onPress={() => {
                            this.goSearchScreen()
                        }}
                    />
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
                {this.state.currentHole == 19 ? this.parhcpList() : this.editDetailComponent()}
            </View>
        )
    }

    parhcpList = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <View style={{ height: 200 }}>
                    <FlatList
                        style={{ paddingTop: 10 }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={this.state.holes}
                        renderItem={({ item, key }) => (
                            <View>
                                <Text style={item.holesNumber === 0 ? styles.hole0 : styles.hole}>{item.holesNumber === 0 ? 'Hole' : item.holesNumber}</Text>
                                {item.holesNumber == 0 ? (
                                    <View>
                                        <Text style={styles.parhcp0}> Par</Text>
                                        <Text style={styles.parhcp0}> Hcp</Text>
                                    </View>
                                ) : (
                                    <View>
                                        <TextInput
                                            style={styles.parhcp}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            placeholder=""
                                            value={this.state.par[item.holesNumber - 1]}
                                            onChangeText={text => this.editPar(text, item.holesNumber - 1)}
                                            editable={false}
                                        />
                                        <TextInput
                                            style={styles.parhcp}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            placeholder=""
                                            value={this.state.hcp[item.holesNumber - 1]}
                                            onChangeText={text => this.editHcp(text, item.holesNumber - 1)}
                                            editable={false}
                                        />
                                    </View>
                                )}
                            </View>
                        )}
                        keyExtractor={item => item.key}
                    />
                </View>
                <TouchableOpacity onPress={() => this.goBackHome()} style={styles.buttonView}>
                    <Text style={styles.confirmButton}> บันทึก </Text>
                </TouchableOpacity>
            </View>
        )
    }

    editDetailComponent = () => {
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
                        onPress={() => this.setState({ currentHole: this.state.currentHole >= 2 ? this.state.currentHole - 1 : 1 })}
                        style={styles.buttonView}
                    >
                        <Text style={styles.changeHole}> Previous </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ currentHole: this.state.currentHole + 1 })} style={styles.buttonView}>
                        <Text style={styles.changeHole}> Next </Text>
                    </TouchableOpacity>
                </View>
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
        backgroundColor: '#d6ff00',
        fontWeight: 'bold',
        fontSize: 20,
        borderRadius: 2,
        width: 40,
        textAlign: 'center'
    },

    hole0: {
        marginBottom: 5,
        marginTop: 10,
        padding: 6,
        backgroundColor: '#d6ff00',
        fontWeight: 'bold',
        fontSize: 20,
        borderRadius: 2,
        width: 80,
        textAlign: 'center'
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
        fontSize: 30,
        marginTop: 30
    },
    buttonView: {
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#1870FF',
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

export default connect(mapDispatchToProps)(AddCourseScreen)
