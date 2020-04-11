/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import vision from '@react-native-firebase/ml-vision';
import React,{Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Navigator
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Home from './src/Screens/Home'
import ScoreView from './src/Screens/ScoreView'
import ScoreView2 from './src/Screens/ScoreView2'
import History from './src/Screens/History'
import SearchScreen from './src/Screens/SearchScreen'
import CourseDetailScreen from './src/Screens/CourseDetailScreen'
import AddCourseScreen from './src/Screens/AddCourseScreen'
import {Scene,Route, Router, ActionConst} from 'react-native-router-flux'
import HomeTab from './src/Components/HomeTab'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import golfApp from './src/reducer/index'

const store = createStore(golfApp)
console.log(store.getState())
store.dispatch({type:'SET_COURSE_NAME',courseName:"Sfdsfd"});
console.log("Store = ",store.getState());

export default class App extends Component {
    render() {
      return(
        <Provider store={store}>
          <Router>
            <Scene key = 'root'>
            <Scene key='Tabbar' tabs={true} tabBarStyle={styles.tabBar} hideNavBar={true} default='Main'>
                <Scene key = 'Home' component = {Home} title = 'HOME' hideNavBar = {true} type = {ActionConst.REPLACE} initial = {true} icon={HomeTab}/>
                <Scene key = 'Home1' component = {History} title = 'HISTORY' hideNavBar = {true} type = {ActionConst.REPLACE} initial = {false}/>
            </Scene>
            <Scene key = 'ScoreView' component = {ScoreView} title = 'ScoreView' type = {ActionConst.PUSH}/>
            <Scene key = 'ScoreView2' component = {ScoreView2} title = 'ScoreView2' type = {ActionConst.PUSH}/>
            <Scene key = 'SearchScreen' component = {SearchScreen} title = 'Search' type = {ActionConst.PUSH} hideNavBar={true}/>
            <Scene key = 'CourseDetailScreen' component = {CourseDetailScreen} title = 'CourseDetail' type = {ActionConst.PUSH} hideNavBar={true}/>
            <Scene key = 'AddCourseScreen' component = {AddCourseScreen} title = 'AddCourseScreen' type = {ActionConst.PUSH} hideNavBar={true}/>
            </Scene>
          </Router>
        </Provider>
      );  
    }
}

const styles = StyleSheet.create({
  tabBar: {
  height: 50,
  borderTopColor: 'darkgrey',
  borderTopWidth: 1,
  opacity: 0.98,
  justifyContent:'space-between',
  fontSize : 50
  }
});