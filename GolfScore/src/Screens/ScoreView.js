import React,{Component} from 'react';
import ImagePicker from 'react-native-image-picker';
import {Actions} from 'react-native-router-flux'
import googleAPI from '../api/googleApi'
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
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
import { connect} from 'react-redux'
import {Icon} from 'native-base'

const options = {
        title: 'Select Avatar',
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
        quality: 0.4,
        tintColor : '#000000'
};

class ScoreView extends Component {

    constructor(props){
      super(props)
      this.state = {
        score : this.props.texts,
        score1 : [''],
        showIndicator : false,
        isComplete : false,
        holes : []
      }
    }

    componentDidMount(){
      this.setState({
         holes : this.findHoles()
      })
    }

    findHoles(){
       var hole = 0
       var allHoles = []
       for(i=0;i<this.state.score.length;i++){
            if(this.state.score[i].length>hole){
              hole = this.state.score[i].length
            }
       }
       for(i=0;i<=10;i++) {
          allHoles.push(i)
       }

       return allHoles
       
    }

    onPressButton() {
        if(this.state.isComplete){
            this.goCalculateScoreView(false)
            console.log("1231321")
        }
        // else {
          this.setState({
                      isComplete : true,
                      score1 : this.state.score
          },() =>{
            const data = [['P1','5','2','3','4','4','3','5','4','4'],['P2','4','2','3','4','3','4','4','3','5'],['P3','1','3','3','4','5','6','4','5','3']]

                    this.setState({
                      showIndicator: false,
                      score : data,
                    })
          })
        //   console.log(this.state.score)
        //   this.showImagePicker()
        // const data = [['P1','5','2','3','4','4','3','5','4','4'],['P2','4','2','3','4','3','4','4','3','5'],['P3','1','3','3','4','5','6','4','5','3']]

        //             this.setState({
        //               showIndicator: false,
        //               score : data,
        //             })
       // }
    }

     goCalculateScoreView = (isOnePage) => {
       if(isOnePage){
           Actions.ScoreView2({score: this.state.score,holes : this.findHoles()})
       }
       else {
          if(this.state.score.length == this.state.score1.length){
            var array = [...this.state.score1]
            const array1 = [...this.state.score]
            for(let i=0 ; i<this.state.score.length ; i++){
                  console.log(array[i])
                  array[i] = array[i].concat(array1[i].splice(1))
            }

            this.setState({score : array},() => {
              console.log(array)
              Actions.ScoreView2({score: array,holes : this.findHoles()})
            })
          }
       }
    }

    showImagePicker = () => {
        ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            const source = { uri: response.uri };
          
            this.callApi(response.data)
       }
          });
    }

    callApi(data){
            this.setState({
                showIndicator: true
            });
            googleAPI.postImage(data,(err,data) => {
                    console.log(data+"  page 2")

                    this.setState({
                      score1 : this.state.score
                    })

                    this.setState({
                      showIndicator: false,
                      score : data
                    },()=>{
                      this.setState({holes : this.findHoles()})
                    })
                    
                   
            })
    }

    removePlayer = (key) =>{
        console.log(this.state.score[key])
        var filteredData = this.state.score.filter(item => item != this.state.score[key]);
        for(i=0 ;i< filteredData.length;i++){
           filteredData[i].splice(0,1)
           filteredData[i].splice(0,0,`P${i+1}`)
        }
        this.setState({score:filteredData})
        console.log(filteredData)
    }
    
    onChangeText = (text,key,item) => {
        const newArray = [...this.state.score];
        newArray[key][item]=text
        // if(text == '')
        //     newArray.splice(key,1)
        this.setState({score : newArray})
        console.log(text)
        console.log(key)
        console.log(item)
    }

    increaseHole = () =>{
        var allHoles = [...this.state.holes]
        allHoles.push(this.state.holes.length)
        this.setState({holes : allHoles})
        var score = [...this.state.score]
        for(var i=0;i<score.length;i++)
          score[i].push("")
        this.setState({score:score})
    }

    decreaseHole = () =>{
        var allHoles = [...this.state.holes]
        allHoles.pop()
        this.setState({holes : allHoles})
        var score = [...this.state.score]
        var maxLenght = 0
        for(var i=0;i<score.length;i++){
          if(maxLenght < score[i].length){
            maxLenght = score[i].length
          }
        }
        
        for(var i=0;i<score.length;i++){
          if(maxLenght == score[i].length){
             score[i].pop()
          }
        }

        this.setState({score:score},()=>{console.log(this.state.score)})
    }

    playerScoreElement = (holeNumber) => {
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
            return( 
                    <View>
                      <TextInput
                            returnKeyType = 'done' 
                            style={styles.column1}
                            editable={true}
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
               <TouchableOpacity onPress = {()=>{this.removePlayer(key)}} style = {{marginLeft : 10 , marginBottom : 35 ,padding : 6}}>
                         <Icon type="FontAwesome" name="remove" style = {{fontSize : 30,color : '#FF0000'}}/>
               </TouchableOpacity>
           )
         }
      })
    }

    render(){
        console.log(this.state.score[0].length)
        return (
            <View style = {{flex:1,backgroundColor : 'white'}}>
              <View style = {{backgroundColor : 'white'}}>
                    <FlatList
                      style = {{padding : 5}}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={this.state.holes}
                      renderItem={({ item ,key}) => 
                                      <View>
                                        <Text style = {{marginLeft : 10 , marginBottom : 5 ,marginTop : 10, borderWidth : 1,padding : 6 , backgroundColor : '#d6ff00',fontWeight : 'bold',fontSize : 20, borderRadius : 2}}>{item === 0 ? 'Hole' : this.state.isComplete ? parseInt(item)+this.state.score1[0].length-1 : item}</Text>
                                        {this.playerScoreElement(item)}  
                                      </View>
                      }
                      keyExtractor={item => item.id}
                    />
                  {/* <View style = {{marginTop : 0,flexDirection : "row",justifyContent : 'space-evenly',marginLeft : 0 , marginRight : 0}}>
                      <Button 
                          title = 'Increase Hole' 
                          style = {{borderWidth : 1}}
                          onPress = {()=>{this.increaseHole()}}
                      />
                      <Button 
                          title = 'Decrease Hole' 
                          onPress = {()=>{this.decreaseHole()}}
                      />
                  </View>   */}

                  <View style = {styles.buttonView}>
                      <Button 
                          title = {this.state.isComplete ? "Calculate Score" : "Scan Next Page"}
                          onPress = {()=>{this.onPressButton()}}
                      />
                      {!this.state.isComplete &&
                         <Button 
                          title = "Calculate Score"
                          onPress = {()=>{this.goCalculateScoreView(true)}}
                          />
                      }  
                  </View>  

              </View>
              {this.state.showIndicator && 
                    <View style = {{flex : 1,justifyContent : 'center', position: 'absolute',bottom : 0,top : 0,left : 0,right : 0}}> 
                      <View style = {styles.loading}>
                          <ActivityIndicator size ="large" color = "#FFFFFF"  animating = {this.state.showIndicator} style={{justifyContent : 'center'}}/>
                      </View>
                    </View>
              }
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
    borderColor: 'black',
    paddingLeft: 20,
    margin: 10,
    borderRadius: 20,
    fontSize : 30,
    color : 'black',
    backgroundColor : 'white',
  },
  loading : {
    position : 'absolute',
    width : 100,
    height : 100,
    justifyContent : 'center',
    borderWidth : 1,
    borderRadius : 6,
    alignSelf : 'center',
    backgroundColor : '#000000',
    opacity : 0.8,
  },
  column0 : {
    marginLeft : 10 , 
    marginBottom : 5 , 
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
  }
})

const mapStateToProps = state => ({
    courseName : state.courseName,
    par : state.par,
    hcp : state.hcp
});

export default connect(mapStateToProps)(ScoreView)