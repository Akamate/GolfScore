import React from 'react'
import {View,Text,FlatList,StyleSheet,TouchableOpacity,Button,TextInput} from 'react-native'
import {Actions} from 'react-native-router-flux'
import { connect} from 'react-redux'
import {setCourseName,setPar,setHcp} from '../reducer/actions'
import db from '../api/config'

class AddCourseScreen extends React.Component {

    constructor(props){
      super(props)
      this.state = {
        par : [],
        hcp : [],
        holes : [],
        numOfHoles : 0,
        courseName : "",
      }
    }

    componentDidMount(){
       this.setHoleArray();
    }

    setHoleArray = () => {
        var allHoles = []
        for(i=0;i<=this.state.numOfHoles;i++) {
          allHoles.push({key : i,holesNumber : i})
       }
       this.setState({holes: allHoles},() => {
           this.setParHcp();
       })
    }

    onChangeCourseName = (text) => {
        this.setState({courseName : text})
    }

    onChangeNumOfHoles = (numOfHoles) => {
        this.setState({numOfHoles : parseInt(numOfHoles)},() => {
            this.setHoleArray();
        })
    }

    setParHcp() {
        const par = []
        const hcp = []
        for(i=0;i<=this.state.numOfHoles;i++) {
            par.push('')
            hcp.push('')
        }
        this.setState({
            par : par,
            hcp : hcp
        })
    }

    
    editPar = (text,holesNumber) => {
        const par = [...this.state.par]
        par[holesNumber-1] = text
        this.setState({par : par})
    }

    editHcp = (text,holesNumber) => {
        const hcp = [...this.state.hcp]
        hcp[holesNumber-1] = text
        this.setState({hcp : hcp})
    }
    
    goBackHome() {
        const courseName = this.state.courseName
        const par = this.state.par
        const hcp = this.state.hcp

        if(courseName != ''){
            db.ref('/courseLists').push({
                courseName,
                par,
                hcp
            }).then((data)=>{
                //success callback
                this.props.setCourseName(this.state.courseName)
                this.props. setPar(this.state.par)
                this.props.setHcp(this.state.hcp)
                Actions.reset('Tabbar')
                console.log('data ' , data)
            }).catch((error)=>{
                //error callback
                console.log('error ' , error)
            })
        }
    }

    goSearchScreen() {
        Actions.pop()
    }

    render() {

        return(
            <View style = {styles.container}>
                <View style = {styles.button}>
                        <Button title = "< Back" onPress={()=>{this.goSearchScreen()}}/>
                </View>
                <View style = {styles.textInput}>
                    <TextInput
                        autoCapitalize = "none"
                        autoCorrect = {false}
                        placeholder = "Name Golf Course" 
                        style = {styles.textInput}
                        value={this.state.courseName}
                        onChangeText = {text => this.onChangeCourseName(text)}
                        onEndEditing = {this.onEndEditing}
                    />
                    <TextInput
                        autoCapitalize = "none"
                        autoCorrect = {false}
                        placeholder = "Num Of Holes" 
                        style = {styles.textInput}
                        value={this.state.numOfHoles}
                        keyboardType = "number-pad"
                        onChangeText = {text => this.onChangeNumOfHoles(text)}
                        onEndEditing = {this.onEndEditing}
                    />
                </View>
                <View style = {{alignItems : 'center'}}>
                    <View style = {{height : 200}}>
                        <FlatList
                                style = {{paddingTop : 10}}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={this.state.holes}
                                renderItem={({ item ,key}) => 
                                                <View>
                                                    <Text style = {item.holesNumber === 0 ? styles.hole0 :styles.hole}>{item.holesNumber === 0 ? 'Hole' : item.holesNumber}</Text>
                                                    { item.holesNumber == 0 ?
                                                        <View>
                                                            <Text style = {styles.parhcp0 }> Par</Text>
                                                            <Text style = {styles.parhcp0 }> Hcp</Text>
                                                        </View>
                                                         :
                                                         <View>
                                                            <TextInput
                                                                style = {styles.parhcp}
                                                                autoCapitalize = "none"
                                                                autoCorrect = {false}
                                                                placeholder = ""
                                                                value={this.state.par[item.holesNumber-1]}
                                                                onChangeText = {text => this.editPar(text,item.holesNumber)}
                                                            />
                                                            <TextInput
                                                                style = {styles.parhcp}
                                                                autoCapitalize = "none"
                                                                autoCorrect = {false}
                                                                placeholder = ""
                                                                value={this.state.hcp[item.holesNumber-1]}
                                                                onChangeText = {text => this.editHcp(text,item.holesNumber)}
                                                            />
                                                        </View>
                                                    }      
                                                </View>
                                }
                                keyExtractor={item => item.key}
                            />
                    </View>
                    <TouchableOpacity onPress={()=>this.goBackHome()} style ={styles.buttonView}>
                        <Text style = {styles.confirmButton}> บันทึก </Text>
                    </TouchableOpacity>
                 </View> 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor : '#FFFFFF',
        flex : 1,
        
    },
    hole : { 
        //marginLeft : 1 , 
        marginBottom : 5 ,
        marginTop : 10, 
        padding : 6,
        backgroundColor : '#d6ff00',
        fontWeight : 'bold',
        fontSize : 20, 
        borderRadius : 2,
        width : 40,
        textAlign : 'center'
    },

    hole0 : { 
      //  marginLeft : 1 , 
        marginBottom : 5 ,
        marginTop : 10, 
        padding : 6,
        backgroundColor : '#d6ff00',
        fontWeight : 'bold',
        fontSize : 20, 
        borderRadius : 2,
        width : 60,
        textAlign : 'center'
    },

    parhcp : { 
        marginLeft : 10 , 
        marginBottom : 5 ,
        marginTop : 10, 
        borderWidth : 1,
        padding : 6,
        backgroundColor : '#ffffff',
        fontSize : 20, 
        borderRadius : 2,
        textAlign : 'center'
    },

    parhcp0 : { 
       // marginLeft : 1 , 
        marginBottom : 5 ,
        marginTop : 10, 
        width : 60,
        padding : 6,
        backgroundColor : '#ffffff',
        fontWeight : 'bold',
        fontSize : 20, 
        borderRadius : 2,
        textAlign : 'center'
    },
    title : {
        marginTop : 10,
        fontSize : 30 
    },
    confirmButton : {
        fontSize : 30,
        color : '#FFFFFF'
    },
    holesNum : {
        marginTop : 10,
        fontSize : 20 
    },
    button : { 
        alignItems :'flex-start',
        marginLeft : 10,
        marginTop : 30
    },
    textInput : {
        alignItems : 'center',
        fontSize : 30,
        marginTop : 30,
    },
    buttonView : {
        borderRadius : 4 , 
        paddingHorizontal : 30,
        paddingVertical : 12,
        backgroundColor : "#1870FF",
        marginTop : 50,
    }
})

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  setCourseName: (courseName) => dispatch(setCourseName(courseName)),
  setPar: (par) => dispatch(setPar(par)),
  setHcp: (hcp) => dispatch(setHcp(hcp))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCourseScreen);