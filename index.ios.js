// @flow

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  View,
  Text,
} from 'react-native';

import CalendarPicker from './CalendarPicker/CalendarPicker'

export default class NewCalendarPicker extends Component {
  state = {
    date: new Date()
  }

  onDateChange = (date: Date) => this.setState({date})

  render() {
    return (
      <View style={styles.container}>
      <CalendarPicker
          selectedDate={this.state.date}
          onDateChange={this.onDateChange}
          screenWidth={Dimensions.get('window').width}
          weekdays = {['Mon', 'Tue', 'Wed', 'Th', 'Fri', 'Sat', 'Sun']}
          months = {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']}
          nextTitle={'Next'}
          previousTitle={'Previous'}
          startFromMonday={true}
          selectedDayColor={'#E12518'}
          textStyle={styles.calendarTextStyle}
          selectedDayTextColor={'#FFFFFF'}
                style={{}} />

        <Text style={styles.selectedDate}> Date: { this.state.date.toString() } </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('NewCalendarPicker', () => NewCalendarPicker);
