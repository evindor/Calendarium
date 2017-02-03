// @flow

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  View,
  Text,
} from 'react-native';

import CalendarPicker from 'react-native-calendarium'

export default class NewCalendarPicker extends Component {
  state = {
    date: new Date(),
      start_date: new Date(),
      rangeSelection: true,
      end_date: null
  }

  onDateChange = (date: Date) => {
    if(this.state.rangeSelection) {
      this.setState({ start_date: date.start_date, end_date: date.end_date});
    } else {
      this.setState({ date: date });
    }
  }

  render() {
    return (
      <View style={styles.container}>
      <CalendarPicker
          selectedDate={this.state.date}
          fromDate={this.state.start_date}
          toDate={this.state.end_date}
          onDateChange={this.onDateChange}
          allowRangeSelection={true}
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

        { ! this.state.rangeSelection &&
          <Text style={styles.selectedDate}> Date: { this.state.date.toString() } </Text>}
        { this.state.rangeSelection &&
          <View>
            { this.state.start_date && <Text style={styles.selectedDate}> Start date: { this.state.start_date.toString() } </Text> }
            { this.state.end_date && <Text style={styles.selectedDate}> End date: { this.state.end_date.toString() } </Text> }
          </View>
        }
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
