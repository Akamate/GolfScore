import React from 'react'
import { Text, Platform, StyleSheet, View, Button, FlatList, TouchableOpacity } from 'react-native'
import SearchBar from '../Components/Searchbar'
import { Actions } from 'react-native-router-flux'
import db from '../api/config'

class SearchScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            results: [],
            term: ''
        }
    }

    componentDidMount() {
        db.ref('/courseLists').on('value', querySnapShot => {
            let data = querySnapShot.val() ? querySnapShot.val() : {}
            let courseLists = []
            querySnapShot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val()
                let firstChar = childData.courseName[0]
                // childData.courseName = childData.courseName.toString().slice(1)
                childData.courseName = childData.courseName.toUpperCase()
                childData.key = childSnapshot.key
                courseLists.push(childData)
            })
            this.setState({
                results: courseLists
            })
        })
    }

    searchApi(term) {
        db.ref('/courseLists')
            .orderByChild('courseName')
            .startAt(term.toLowerCase())
            .endAt(term.toLowerCase() + '\uf8ff')
            .on('value', querySnapShot => {
                let data = querySnapShot.val() ? querySnapShot.val() : {}
                let courseLists = []
                querySnapShot.forEach(function(childSnapshot) {
                    var childData = childSnapshot.val()
                    let firstChar = childData.courseName[0]
                    childData.courseName = childData.courseName.toUpperCase()
                    childData.key = childSnapshot.key
                    courseLists.push(childData)
                })
                this.setState({
                    results: courseLists
                })
            })
    }

    goBackHome = () => {
        Actions.pop()
    }

    gotoCourseDetail = key => {
        const result = this.state.results.filter(result => result.key == key)
        if (result[0] != null) {
            Actions.CourseDetailScreen({
                par1: result[0].par,
                hcp1: result[0].hcp,
                courseName1: result[0].courseName
            })
        }
    }

    addCourse = () => {
        Actions.AddCourseScreen()
    }
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF'
                }}
            >
                {Platform.OS == 'ios' && (
                    <View style={styles.button}>
                        <Button title="< Back" onPress={this.goBackHome} />
                    </View>
                )}

                <View style={styles.button1}>
                    {/* <TouchableOpacity onPress={this.addCourse}>
                        <Text style={{ fontSize: 20, color: 'sky' }}>ADD</Text>
                    </TouchableOpacity> */}
                    <Button title="ADD" onPress={this.addCourse} />
                </View>

                <View style={[styles.background, { marginTop: Platform.OS == 'ios' ? 5 : 80 }]}>
                    <SearchBar
                        term={this.state.term}
                        onChangeText={text => this.setState({ term: text })}
                        onEndEditing={() => this.searchApi(this.state.term)}
                    />
                </View>
                <FlatList
                    style={{ padding: 5 }}
                    showsHorizontalScrollIndicator={false}
                    data={this.state.results}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => this.gotoCourseDetail(item.key)}>
                            <Text style={styles.courseName}>{item.courseName}</Text>
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
                    keyExtractor={item => item.key}
                />
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
        fontSize: 20,
        fontFamily: 'Avenir Next'
    }
})

export default SearchScreen
