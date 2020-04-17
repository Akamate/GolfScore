import React,{Component} from 'react';
import {Actions} from 'react-native-router-flux'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import {Icon} from 'native-base'
import { connect} from 'react-redux'

class ScoreView2 extends Component {

  constructor(props){
    super(props)
    this.state = {
        score : [],
        holes : [],
        total : []        
    }
  }

  componentDidMount() {
    this.findHoles();
    this.setState({score : this.props.score,},()=> {
      this.calculateScore();
    })
  }

  findHoles = () => {
      const holes = []
      let hole = 0
      for(i=0;i<18;i++){
           if(!isNaN(this.props.score[0][i]) && this.props.score[0][i]!=''){
              hole += 1
           }
      }
      for(i=0;i<=hole+1;i++){
           holes.push(i)
      }
      this.setState({holes : holes})
  }

  onChangeText(text,key){
    const newArray = [...this.state.score];
    newArray[key]=text
    this.setState({score : newArray})
  }
  goBacktoHomeView(){
    Actions.reset('Home')
  }
  
  totalScore = () => {
    var scores = []
    for(var i=0;i<this.state.score.length;i++){
      var score = 0
      for(var j=1;j<this.state.score[i].length;j++){
          if(!isNaN(this.state.score[i][j]) && this.state.score[i][j]!= '')
            score += parseInt(this.state.score[i][j])
      }
      scores.push(score)
    }
    return scores
  }

  calculateScore = () => {
    var hcps = []
    var scores = this.totalScore()
    for(j=0 ;j< this.state.score.length;j++){
      var hcp = 0
      for(i=0;i<this.state.score.length;i++){
        if(this.props.par[i]-parseInt(this.state.score[j][i+1])==1){
            hcp += 1
        }
        else if(this.props.par[i]-parseInt(this.state.score[j][i+1])>1){
            hcp += 2
        }
      } 
      hcps.push(hcp)
    }
    for(i=0;i<scores.length;i++)
      scores[i] = scores[i]-hcps[i]
    
    this.setState({total : scores})
  }

  calculateColor = (score,index) => {
    if(score<this.props.par[index-1]){
      return "#0000FF"
    }
    else if(score > this.props.par[index-1]){
      return "#FF0000"
    }
    else return "#000000"
  }

  playerScoreElement(holeNumber){
    return this.state.score.map((texts,key)=> {
      if(holeNumber ==0){
        return (
          <View>
            <Text  style = {styles.column0}>{texts[holeNumber]}</Text>
            <Text style={{marginLeft : 10 , marginBottom : 10,padding : 3}}> </Text>
          </View>
        )
      }
      else if(holeNumber != this.state.holes.length-1){
        return (
          <View>
            <TextInput
              returnKeyType = 'done' 
              style={{textAlign : 'center',marginLeft : 10 , marginBottom : 0 , borderWidth : 1,padding : 6 , color : this.calculateColor(texts[holeNumber],holeNumber),fontSize : 20, borderRadius : 2,fontFamily: 'Avenir Next' }}
              editable={false}
              value={texts[holeNumber]}
              onChangeText={text => this.onChangeText(text,key,holeNumber)}
              keyboardType = 'number-pad'
            />
            <Text style={{marginLeft : 10 , marginBottom : 10,padding : 3,textAlign : 'center'}}>{parseInt(texts[holeNumber])-parseInt(this.props.par[holeNumber-1]) > 0 ?
                "+"+(parseInt(texts[holeNumber])-parseInt(this.props.par[holeNumber-1]).toString())
                :
                parseInt(texts[holeNumber])-parseInt(this.props.par[holeNumber-1])
                }
            </Text>
          </View>
        )
       }
      else {
        return (
          <View>
              <Text  style = {styles.column0}>{this.totalScore()[key]}</Text>
              <Text style={{marginLeft : 10 , marginBottom : 10,padding : 3}}></Text>
          </View>
        )
      }
    })
  }
  
  render(){
    return (
      <ScrollView style = {{flex:1,backgroundColor : 'white'}}>
        <FlatList
          style = {{padding : 0,marginLeft : 10}}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={this.state.holes.slice(0,this.state.holes.length)}
          renderItem={({ item ,key}) => 
                          <View>
                            <Text style = {styles.row0}>{item === 0 ? 'Hole' : item=== this.state.holes.length-1 ? "TOT" : item}</Text>
                            {this.playerScoreElement(item)}
                            { item != this.state.holes.length-1 ? 
                                <View>
                                  <Text style = {styles.parhcp}>{item === 0 ? 'PAR' : this.props.par[item-1]}</Text>
                                  <Text style = {styles.parhcp}>{item === 0 ? 'HCP' : this.props.hcp[item-1]}</Text>
                                </View>
                                :
                                <Text></Text>
                            }
                          </View>
          }
          keyExtractor={item => item.id} 
        />
        <View style = {{alignItems : 'center',marginTop : 20}}>
          {this.state.total.map((score,index) => 
              <Text style = {{fontSize : 20,fontWeight : 'bold', alignItems : 'center'}}> P{index+1} {score} Points</Text>
          )}
        </View>
        <View style = {styles.buttonView}>
          <TouchableOpacity style = {styles.buttonTouchable} onPress = {()=>{Actions.reset('Home')}} >
            <Text style = {styles.buttonText}>OK</Text>
          </TouchableOpacity>  
        </View>
      </ScrollView>
    )
  }
    
}

const styles = StyleSheet.create({
  textInputView: {
    width: '100%',
    backgroundColor: 'white'
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    borderColor: 'white',
    paddingLeft: 20,
    margin: 10,
    borderRadius: 20,
    fontSize : 20,
    color : 'black',
    backgroundColor : 'grey'
  },

  buttonTouchable : {
    borderRadius : 30,
    borderWidth : 2,
    paddingHorizontal : 50,
    paddingVertical : 10,
    backgroundColor : '#000000',
    marginBottom : 20
  },
  buttonText : {
    fontSize : 20,
    color : '#FFFFFF',
    textAlign : 'center',
    fontFamily: 'Avenir Next'
  },
  buttonView: {
    marginTop : 30,
    alignSelf : 'center',
    textAlign : 'center',
    justifyContent : 'center',
  },

  column0 : {
    marginLeft : 10 , 
    marginBottom : 2 , 
    borderWidth : 0,
    padding : 6 , 
    backgroundColor : '#ffffff',
    fontWeight : 'bold',
    fontSize : 20, 
    borderRadius : 2,
    fontFamily: 'Avenir Next'
  },
  column1 : {
    marginLeft : 10 , 
    marginBottom : 5 , 
    borderWidth : 1,
    padding : 4 , 
    backgroundColor : '#ffffff',
    fontSize : 20, 
    borderRadius : 2,
    fontFamily: 'Avenir Next',
    textAlign : 'center'
  },
  row0 : {
    marginLeft : 0 ,
    marginBottom : 10 ,
    marginTop : 10,
    borderWidth : 0,
    padding : 6 ,
    backgroundColor : '#323232',
    color : "#FFFFFF",
    fontWeight : 'bold',
    fontSize : 20, 
    borderRadius : 2,
    width : 60,
    textAlign : 'center',
  },
  parhcp : { 
    marginBottom : 0 ,
    marginTop : 0, 
    backgroundColor : '#323232',
    padding : 6,
    fontSize : 20, 
    borderRadius : 2,
    textAlign : 'center',
    color : '#FFFFFF',
    fontWeight : 'bold',
  },
  
})

const mapStateToProps = (state) => ({
    courseName : state.courseName,
    par : state.par,
    hcp : state.hcp
});

export default connect(mapStateToProps)(ScoreView2)