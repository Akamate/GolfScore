import React from 'react'
import { Text, ScrollView, StyleSheet, View, Button, FlatList, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Share from 'react-native-share'
import { PlayerSchema } from '../model/player'
import { connect } from 'react-redux'
import CustomButton from '../Components/CustomButton'
import ScoreLists from '../Components/ScoreLists'
var RNFS = require('react-native-fs')
const Realm = require('realm')

class MultipleExportScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            results: null,
            term: '',
            date: '',
            courseName: '',
            isSelected: false,
            playersScore: null,
            score: [],
            playerName: '',
            isPageOne: true
        }
    }

    componentDidMount() {
        this.getPlayerDetail()
    }

    getPlayerDetail = () => {
        Realm.open({ schema: [PlayerSchema] }).then(realm => {
            const players = realm
                .objects('Player')
                .filtered(
                    'date = $0 AND golfCourse = $1',
                    `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
                    this.props.courseName
                )
            console.log(players)
            const players1 = realm.objects('Player')
            console.log(players1)
            if (players.length != 0) {
                const result = []
                const playersScore = []
                players.map((player, index) => {
                    result.push({ name: player.name, index: index })
                    playersScore.push([])
                    player.scores.map(score => {
                        playersScore[index].push(score)
                    })
                })

                this.setState({
                    results: result,
                    date: players['0'].date,
                    courseName: players['0'].golfCourse,
                    playersScore: playersScore
                })
            }
            realm.close()
        })
    }

    showPlayerDetail = index => {
        console.log(index)
        const score = []
        score.push(this.state.playersScore[index])
        this.setState({ score: score, isSelected: true, playerName: this.state.results[index].name })
    }

    goBackHome = () => {
        if (this.state.isSelected) {
            this.setState({ isSelected: false })
        } else {
            Actions.reset('Home')
        }
    }

    exportCSV = () => {
        var hole = 'Hole,'
        var par = 'PAR,'
        var hcp = 'HCP,'
        console.log(this.state.playersScore)
        if (this.state.playersScore[0].length > 12) {
            hole = 'Hole,1,2,3,4,5,6,7,8,9,OUT,10,11,12,13,14,15,16,17,18,IN,TOT,H/C,NET\n'
            for (i = 0; i < this.props.par.length; i++) {
                par += `${this.props.par[i]},`
                hcp += i == 9 ? '  ,' : i < 9 ? `${this.props.hcp[i]},` : i < 19 ? `${this.props.hcp[i - 1]},` : ''
            }
        } else {
            hole = 'Hole,1,2,3,4,5,6,7,8,9,OUT,H/C,NET\n'
            for (i = 0; i < 10; i++) {
                par += `${this.props.par[i]},`
                hcp += i < 9 ? `${this.props.hcp[i]},` : ' '
            }
        }
        scores = ''
        for (i = 0; i < this.state.playersScore.length; i++) {
            scores += this.state.results[i].name + ','
            for (j = 0; j < this.state.playersScore[i].length; j++) {
                if (this.state.playersScore[i][j] != '') {
                    scores += `${this.state.playersScore[i][j]},`
                }
            }
            scores += '\n'
        }
        par += '\n'
        hcp += '\n'
        alltext = hole + scores + par + hcp
        console.log(alltext)
        // write the file
        this.writeFile(alltext)
    }

    writeFile = alltext => {
        var courseName = this.state.courseName.split(' ')[0]
        var path = RNFS.DocumentDirectoryPath + `/${courseName} ${this.state.date}.csv`
        RNFS.writeFile(path, alltext, 'utf8')
            .then(success => {
                console.log('FILE WRITTEN!')
                Share.open({ url: `file://${path}` })
                    .then(res => {
                        console.log(res)
                    })
                    .catch(err => {
                        err && console.log(err)
                    })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF'
                }}
            >
                <View style={styles.button}>
                    <Button title="< Back" onPress={this.goBackHome} />
                </View>
                {!this.state.isSelected && (
                    <View>
                        <Text style={styles.title}>{this.state.courseName}</Text>
                        <Text style={styles.title}>{this.state.date}</Text>
                    </View>
                )}
                {this.state.isSelected && (
                    <ScrollView>
                        <Text style={styles.title}>{this.state.playerName}</Text>
                        <ScoreLists
                            par={this.props.par}
                            hcp={this.props.hcp}
                            scores={this.state.score}
                            isComplete={true}
                            isPageOne={this.state.isPageOne}
                        />
                        {/* {this.state.score.length > 13 && (
                            <View style={{ alignItems: 'center' }}>
                                <CustomButton
                                    title={this.state.isPageOne ? 'Next >' : '< Previous'}
                                    onPress={() => this.setState({ isPageOne: !this.state.isPageOne })}
                                />
                            </View>
                        )} */}
                    </ScrollView>
                )}
                {!this.state.isSelected && (
                    <FlatList
                        style={{ padding: 5 }}
                        showsHorizontalScrollIndicator={false}
                        data={this.state.results}
                        renderItem={({ item, key }) => (
                            <TouchableOpacity onPress={() => this.showPlayerDetail(item.index)}>
                                <Text style={styles.courseName}>{item.name}</Text>
                                <View
                                    style={{
                                        height: 1,
                                        borderWidth: 0.5,
                                        marginHorizontal: 20,
                                        borderColor: '#F0EEEE'
                                    }}
                                />
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.index}
                    />
                )}
                {!this.state.isSelected && (
                    <View style={{ alignItems: 'center', marginBottom: 50 }}>
                        <CustomButton title="Export All" onPress={this.exportCSV} />
                    </View>
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#FFFFFF',
        height: 50,
        borderRadius: 5,
        marginHorizontal: 15,
        marginTop: 10,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 3
    },
    button: {
        alignItems: 'flex-start',
        marginLeft: 10,
        marginTop: 40
    },
    button1: {
        position: 'absolute',
        right: 5,
        marginTop: 38
    },
    courseName: {
        marginLeft: 10,
        marginBottom: 5,
        marginTop: 10,
        padding: 6,
        backgroundColor: '#FFFFFF',
        fontSize: 20
    },
    title: {
        marginLeft: 10,
        marginBottom: 0,
        marginTop: 0,
        padding: 6,
        backgroundColor: '#FFFFFF',
        fontSize: 20,
        textAlign: 'center'
    }
})

const mapStateToProps = state => ({
    courseName: state.courseName,
    par: state.par,
    hcp: state.hcp
})

export default connect(
    mapStateToProps,
    null
)(MultipleExportScreen)
