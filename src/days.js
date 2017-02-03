/**
 * @flow
 *
 * Calendar Picker Component
 *
 * Copyright 2016 Yahoo Inc.
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */

import React, {Component} from 'react'
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native'

import type {
  TextStyle,
} from 'react-native'

import Day from './day'
import {
  getDaysInMonth,
} from './Util'

import makeStyles from './makeStyles'

// The styles in makeStyles are intially scaled to this width
const IPHONE6_WIDTH = 375
const initialScale = Dimensions.get('window').width / IPHONE6_WIDTH
const styles = StyleSheet.create(makeStyles(initialScale))

type Props = {
  maxDate: Date,
  minDate: Date,
  fromDate: Date,
  toDate: Date,
  date: Date,
  month: number,
  year: number,
  onDayChange: Function,
  selectedDayColor: string,
  selectedDayTextColor: string,
  textStyle: TextStyle,
}

export default class Days extends Component {
  props: Props

  state = {
    selectedStates: [],
    selectedTypes: [],
  }

  componentDidMount() {
    if (this.props.fromDate && this.props.toDate) {
      this.updateSelectedStates(
        this.props.fromDate.getDate(),
        this.props.toDate.getDate(),
      )
    } else {
      this.updateSelectedStates(this.props.date.getDate())
    }
  }

  // Trigger date change if new props are provided.
  // Typically, when selectedDate is changed programmatically.
  //
  componentWillReceiveProps(newProps: Props) {
    if (newProps.fromDate && newProps.toDate) {
      this.updateSelectedStates(
        newProps.fromDate.getDate(),
        newProps.toDate.getDate(),
      )
    } else {
      this.updateSelectedStates(newProps.date.getDate())
    }
  }

  updateSelectedStates(dayStart: number, dayEnd?: number) {
    const selectedStates = []
    const selectedTypes = []
    const daysInMonth = getDaysInMonth(this.props.month, this.props.year)
    let i

    for (i = 1; i <= daysInMonth; i++) {
      if (i === dayStart && !dayEnd) {
        selectedTypes.push('single')
        selectedStates.push(true)
      } else if (i === dayStart && dayEnd) {
        selectedTypes.push('start_range')
        selectedStates.push(true)
      } else if (i === dayEnd && dayStart) {
        selectedTypes.push('end_range')
        selectedStates.push(true)
      } else if (i > dayStart && i < dayEnd) {
        selectedTypes.push('in_range')
        selectedStates.push(true)
      } else {
        selectedTypes.push('')
        selectedStates.push(false)
      }
    }

    this.setState({
      selectedStates,
      selectedTypes,
    })
  }

  onPressDay(day) {
    // this.updateSelectedStates(day);
    this.props.onDayChange({day})
  }

  // Not going to touch this one - I'd look at whether there is a more functional
  // way you can do this using something like `range`, `map`, `partition` and such
  // (see underscore.js), or just break it up into steps: first generate the array for
  // data, then map that into the components
  getCalendarDays() {
    let columns,
      matrix = [],
      i,
      j,
      month = this.props.month,
      year = this.props.year,
      currentDay = 0,
      thisMonthFirstDay = this.props.startFromMonday ? new Date(year, month, 0) : new Date(year, month, 1),
      slotsAccumulator = 0

    for (i = 0; i < MAX_ROWS; i++) { // Week rows
      columns = []

      for (j = 0; j < MAX_COLUMNS; j++) { // Day columns
        if (slotsAccumulator >= thisMonthFirstDay.getDay()) {
          if (currentDay < getDaysInMonth(month, year)) {
            columns.push(<Day
              key={j}
              day={currentDay + 1}
              selected={this.state.selectedStates[currentDay]}
              type={this.state.selectedTypes[currentDay]}
              date={new Date(year, month, currentDay + 1)}
              maxDate={this.props.maxDate}
              minDate={this.props.minDate}
              onDayChange={this.onPressDay}
              screenWidth={this.props.screenWidth}
              selectedDayColor={this.props.selectedDayColor}
              selectedDayTextColor={this.props.selectedDayTextColor}
              textStyle={this.props.textStyle}
            />)
            currentDay++
          }
        } else {
          columns.push(<Day
            key={j}
            day={''}
            screenWidth={this.props.screenWidth}
          />)
        }

        slotsAccumulator++
      }
      matrix[i] = []
      matrix[i].push(<View style={styles.weekRow}>{columns}</View>)
    }

    return matrix
  }

  render() {
    return <View style={styles.daysWrapper}>{ this.getCalendarDays() }</View>
  }
}
