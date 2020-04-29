import React from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { setCourseName, setPar, setHcp } from '../reducer/actions'
import CustomButton from '../Components/CustomButton'
import ParHcpLists from '../Components/ParHcpList'
class CourseDetailScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            par: [],
            hcp: [],
            courseName: '',
            showIndicator: false,
            isComplete: false,
            holes: []
        }
    }

    componentDidMount() {
        this.setDetail()
    }

    setDetail() {
        const par = this.props.par
        const hcp = this.props.hcp
        const courseName = this.props.courseName
        this.setState(
            {
                par: par,
                hcp: hcp,
                courseName: courseName
            },
            () => {
                this.findHoles()
            }
        )
    }
    findHoles() {
        var hole = 0
        var allHoles = [...this.state.holes]
        for (i = 0; i <= 18; i++) {
            allHoles.push({ key: i, holesNumber: i })
        }
        this.setState({ holes: allHoles })
    }

    goBackHome = () => {
        this.props.setCourseName(this.state.courseName)
        //this.props.setPar(this.state.par)
        this.setPar()
        this.props.setHcp(this.state.hcp)
        Actions.reset('Home')
    }

    setPar = () => {
        console.log('14141')
        var par = this.state.par
        console.log('141412')
        var sumFirst9Hole = 0
        var sumLast9Hole = 0
        for (i = 0; i < 9; i++) {
            if (!isNaN(par[i])) sumFirst9Hole += parseInt(par[i])
        }
        if (par.length > 9) {
            for (i = 9; i < 18; i++) {
                if (!isNaN(par[i])) sumLast9Hole += parseInt(par[i])
            }
            par.push(sumLast9Hole)
            par.push(sumFirst9Hole + sumLast9Hole)
        }
        par.splice(9, 0, sumFirst9Hole)
        console.log(par)
        this.props.setPar(par)
    }

    goSearchScreen = () => {
        Actions.pop()
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={{ backgroundColor: '#ffffff', height: 60 }}>
                    <View style={styles.button}>
                        <Button title="< Back" onPress={this.goSearchScreen} />
                    </View>
                </View>

                <View style={{ alignItems: 'center' }}>
                    <ParHcpLists par={this.state.par} hcp={this.state.hcp} />
                    <CustomButton title="Choose This Course" onPress={this.goBackHome} />
                </View>
            </ScrollView>
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
        width: 60,
        textAlign: 'center',
        color: '#ffffff'
    },

    hole0: {
        marginBottom: 5,
        marginTop: 10,
        padding: 6,
        backgroundColor: '#000000',
        fontWeight: 'bold',
        fontSize: 20,
        borderRadius: 2,
        width: 60,
        textAlign: 'center'
    },

    parhcp: {
        marginBottom: 5,
        marginTop: 10,
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
    title: {
        marginTop: 10,
        fontSize: 30
    },
    confirmButton: {
        fontSize: 30,
        color: '#3012FF'
    },
    holesNum: {
        marginTop: 10,
        fontSize: 20
    },
    button: {
        alignItems: 'flex-start',
        marginLeft: 5,
        marginTop: 20
    }
})

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    setCourseName: courseName => dispatch(setCourseName(courseName)),
    setPar: par => dispatch(setPar(par)),
    setHcp: hcp => dispatch(setHcp(hcp))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CourseDetailScreen)
