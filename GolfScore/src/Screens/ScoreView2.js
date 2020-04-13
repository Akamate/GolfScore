import React,{Component} from 'react';
import ImagePicker from 'react-native-image-picker';
import {Actions} from 'react-native-router-flux'
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import style from './../style'
import { throwStatement } from '@babel/types';
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
        this.setState({
          score : this.props.score,
          holes : this.props.holes,
        },()=> {
        //  console.log(this.state.score)
           this.calculateScore();
        })
    }

    onChangeText(text,key){
        const newArray = [...this.state.score];
        newArray[key]=text
        this.setState({score : newArray})
    }

    goBacktoHomeView(){
      Actions.reset('Tabbar')
    }
    
    calculateScore(){
      var hcps = []
      var scores = []
      for(var i=0;i<this.state.score.length;i++){
        var score = 0
        for(var j=1;j<this.state.score[i].length;j++){
            score += parseInt(this.state.score[i][j])
        }
        scores.push(score)
      }
      console.log(scores)
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

      for(i=0;i<scores.length;i++){
        scores[i] = scores[i]-hcps[i]
      }
      this.setState({total : scores})
      console.log(scores)
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
                          }</Text>
                  </View>
            )
         }
        //  else {
        //    return (
        //        <TouchableOpacity onPress = {()=>{this.removePlayer(key)}} style = {{marginLeft : 10 , marginBottom : 5 ,padding : 6}}>
        //                <Icon type="FontAwesome" name="remove" style = {{fontSize : 30,color : '#FF0000'}}/>
        //                <Text style={{marginLeft : 10 , marginBottom : 1,padding : 6}}> </Text>
        //        </TouchableOpacity>
        //    )
        //  }
      })
    }

    render(){
        return (
            <View style = {{flex:1,backgroundColor : 'white',alignItems : 'center'}}>
                 <FlatList
                      style = {{padding : 5}}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={this.state.holes.slice(0,this.state.holes.length-1)}
                      renderItem={({ item ,key}) => 
                                      <View>
                                        <Text style = {{marginLeft : 10 , marginBottom : 5 ,marginTop : 10,minWidth :35,borderWidth : 1,padding : 6 , backgroundColor : '#d6ff00',fontWeight : 'bold',fontSize : 20, borderRadius : 2,textAlign :'center'}}>{item === 0 ? 'Hole' : item}</Text>
                                        {this.playerScoreElement(item)}
                                        { item != this.state.holes.length-1 ? 
                                            <View>
                                              <Text style = {styles.par}>{item === 0 ? 'PAR' : this.props.par[item-1]}</Text>
                                              <Text style = {styles.hcp}>{item === 0 ? 'HCP' : this.props.hcp[item-1]}</Text>
                                            </View>
                                            :
                                            <Text></Text>
                                        }
                                      </View>
                      }
                      keyExtractor={item => item.id} 
                    />
                {this.state.total.map((score,index) => 
                    <Text style = {{fontSize : 20,fontWeight : 'bold'}}> P{index+1} {score} Points</Text>
                
                )}
                <View style = {styles.buttonView}>
                     <Button title = 'ตกลง' 
                      onPress = {()=>{this.goBacktoHomeView()}}
                     />
                </View>
            </View>
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

  buttonView: {
      margin : 80
  },
  button1 : { 
        position: 'absolute',
        right: 5,
        top: 50,
    },
  column0 : {
    marginLeft : 10 , 
    marginBottom : 0 , 
    borderWidth : 1,
    padding : 6 , 
    backgroundColor : '#efeff5',
    fontWeight : 'bold',
    fontSize : 20, 
    borderRadius : 2,
    fontFamily: 'Avenir Next'
  },
  column1 : {
    marginLeft : 10 , 
    marginBottom : 5 , 
    borderWidth : 1,
    padding : 6 , 
    backgroundColor : '#efeff5',
    fontSize : 20, 
    borderRadius : 2,
    fontFamily: 'Avenir Next'
  },
  par : {
    marginLeft : 10 , 
    marginBottom : 5 ,
    marginTop : 10, 
    borderWidth : 1,
    padding : 6 , 
    backgroundColor : '#ffffff',
    fontWeight : 'bold',
    fontSize : 20, 
    borderRadius : 2,
    textAlign : 'center'
  },
  hcp : {
    marginLeft : 10 , 
    marginBottom : 5 ,
    marginTop : 0, 
    borderWidth : 1,
    padding : 6 , 
    backgroundColor : '#ffffff',
    fontWeight : 'bold',
    fontSize : 20, 
    borderRadius : 2,
    textAlign : 'center'
  }
  
})

const mapStateToProps = state => ({
    courseName : state.courseName,
    par : state.par,
    hcp : state.hcp
});

export default connect(mapStateToProps)(ScoreView2)