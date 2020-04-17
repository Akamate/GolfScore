import React from 'react'
import {View,Text,FlatList,StyleSheet,TouchableOpacity,Button} from 'react-native'
import {Actions} from 'react-native-router-flux'
import { connect} from 'react-redux'
import {setCourseName,setPar,setHcp} from '../reducer/actions'

class CourseDetailScreen extends React.Component {

    constructor(props){
      super(props)
      this.state = {
        par : [],
        hcp : [],
        courseName : '',
        showIndicator : false,
        isComplete : false,
        holes : []
      }
    }

    componentDidMount(){
      this.setDetail()
    }

    setDetail() {
      const par = this.props.par.split(' ')
      const hcp = this.props.hcp.split(' ')
      const courseName = this.props.courseName
      this.setState({
          par : par,
          hcp : hcp,
          courseName : courseName
      },() => {
          this.findHoles()
      })
    }
    findHoles(){
       var hole = 0
       var allHoles = [...this.state.holes]
       for(i=0;i<=this.state.par.length;i++) {
          allHoles.push({key : i,holesNumber : i})
       }
       this.setState({holes: allHoles})
       console.log(this.state.holes)
    }

    goBackHome = () => {
         this.props.setCourseName(this.state.courseName)
         this.props. setPar(this.state.par)
         this.props.setHcp(this.state.hcp)
         Actions.reset('Home')
    }

    goSearchScreen = () => {
        Actions.pop()
    }
    render() {

        return(
            <View style = {styles.container}>
                <View style = {styles.button}>
                        <Button title = "< Back" onPress={()=>{this.goSearchScreen()}}/>
                </View>

                <View style = {{alignItems : 'center'}}>
                    <Text style = {styles.title}> {this.props.courseName}</Text>
                    <Text style = {styles.holesNum}> {this.state.holes.length-1} หลุม</Text>
                    <View style = {{height : 200}}>
                        <FlatList
                                style = {{paddingTop : 10}}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={this.state.holes}
                                renderItem={({ item ,key}) => 
                                                <View>
                                                    <Text style = {item.holesNumber === 0 ? styles.hole0 :styles.hole}>{item.holesNumber === 0 ? 'Hole' : item.holesNumber}</Text>
                                                    <Text style = {item.holesNumber === 0 ? styles.parhcp0 : styles.parhcp}>{item.holesNumber === 0 ? 'Par' : this.state.par[item.holesNumber-1]}</Text>
                                                    <Text style = {item.holesNumber === 0 ? styles.parhcp0 : styles.parhcp}>{item.holesNumber === 0 ? 'Hcp' : this.state.hcp[item.holesNumber-1]}</Text>
                                                </View>
                                }
                                keyExtractor={item => item.key}
                            />
                    </View>
                    <TouchableOpacity onPress={()=>this.goBackHome()}>
                        <Text style = {styles.confirmButton}> เลือกสถานที่นี้ </Text>
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
      //  marginLeft : 1 , 
        marginBottom : 5 ,
        marginTop : 10, 
       // borderWidth : 1,
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
        color : '#3012FF'
    },
    holesNum : {
        marginTop : 10,
        fontSize : 20 
    },
    button : { 
        alignItems :'flex-start',
        marginLeft : 10,
        marginTop : 50,
        flexDirection : 'row',
        
    },
})

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  setCourseName: (courseName) => dispatch(setCourseName(courseName)),
  setPar: (par) => dispatch(setPar(par)),
  setHcp: (hcp) => dispatch(setHcp(hcp))
});

export default connect(mapStateToProps, mapDispatchToProps)(CourseDetailScreen);