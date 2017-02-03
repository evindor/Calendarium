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
  Text,
  TouchableOpacity,
} from 'react-native'

import type {
  Style,
} from 'react-native'

import {
  WEEKDAYS,
  MONTHS,
} from './Util'

import Days from './days'

import makeStyles from './makeStyles'

// The styles in makeStyles are intially scaled to this width
const IPHONE6_WIDTH = 375
const initialScale = Dimensions.get('window').width / IPHONE6_WIDTH
let styles = StyleSheet.create(makeStyles(initialScale))


type WeekDaysLabelsProps = {
  screenWidth: number,
  textStyle: Style,
}

class WeekDaysLabels extends Component {
  props: WeekDaysLabelsProps

  DAY_WIDTH: number

  constructor(props: WeekDaysLabelsProps) {
    super(props)
    this.DAY_WIDTH = (this.props.screenWidth - 16) / 7
  }

  render() {
    return (
      <View style={styles.dayLabelsWrapper}>
        { (this.props.weekdays || WEEKDAYS).map(
          (day, key) =>
            <Text
              key={key}
              style={[styles.dayLabels, this.props.textStyle]}>{day}</Text>) }
      </View>
    )
  }
}

type HeaderProps = {
  month: number,
  year: number,
  getNextYear: Function,
  getPrevYear: Function,
  onMonthChange: Function,
  textStyle: Style,
}

class HeaderControls extends Component {
  props: HeaderProps

  state = {
    selectedMonth: this.props.month,
  }

  // Trigger date change if new props are provided.
  // Typically, when selectedDate is changed programmatically.
  //
  componentWillReceiveProps(newProps) {
    this.setState({
      selectedMonth: newProps.month,
    })
  }

  // Logic seems a bit awkawardly split up between here and the CalendarPicker
  // component, eg: getNextYear is actually modifying the state of the parent,
  // could just let header controls hold all of the logic and have CalendarPicker
  // `onChange` callback fire and update itself on each change
  getNext() {
    const next = this.state.selectedMonth + 1
    if (next > 11) {
      this.setState({selectedMonth: 0},
        // Run this function as a callback to ensure state is set first
        () => {
          this.props.getNextYear()
          this.props.onMonthChange(this.state.selectedMonth)
        },
      )
    } else {
      this.setState({selectedMonth: next},
        () => {
          this.props.onMonthChange(this.state.selectedMonth)
        },
      )
    }
  }

  getPrevious() {
    const prev = this.state.selectedMonth - 1
    if (prev < 0) {
      this.setState({selectedMonth: 11},
        // Run this function as a callback to ensure state is set first
        () => {
          this.props.getPrevYear()
          this.props.onMonthChange(this.state.selectedMonth)
        },
      )
    } else {
      this.setState({selectedMonth: prev},
        () => {
          this.props.onMonthChange(this.state.selectedMonth)
        },
      )
    }
  }

  previousMonthDisabled() {
    return (this.props.minDate &&
             (this.props.year < this.props.minDate.getFullYear() ||
               (this.props.year == this.props.minDate.getFullYear() && this.state.selectedMonth <= this.props.minDate.getMonth())
             )
    )
  }

  nextMonthDisabled() {
    return (this.props.maxDate &&
             (this.props.year > this.props.maxDate.getFullYear() ||
               (this.props.year == this.props.maxDate.getFullYear() && this.state.selectedMonth >= this.props.maxDate.getMonth())
             )
    )
  }

  render() {
    const textStyle = this.props.textStyle

    let previous
    if (this.previousMonthDisabled()) {
      previous = (
        <Text style={[styles.prev, textStyle, styles.disabledTextColor]}>{this.props.previousTitle || 'Previous'}</Text>
      )
    } else {
      previous = (
        <TouchableOpacity onPress={this.getPrevious}>
          <Text style={[styles.prev, textStyle]}>{this.props.previousTitle || 'Previous'}</Text>
        </TouchableOpacity>
      )
    }

    let next
    if (this.nextMonthDisabled()) {
      next = (
        <Text style={[styles.next, textStyle, styles.disabledTextColor]}>{this.props.nextTitle || 'Next'}</Text>
      )
    } else {
      next = (
        <TouchableOpacity onPress={this.getNext}>
          <Text style={[styles.next, textStyle]}>{this.props.nextTitle || 'Next'}</Text>
        </TouchableOpacity>
      )
    }

    return (
      <View style={styles.headerWrapper}>
        <View style={styles.monthSelector}>
          {previous}
        </View>
        <View>
          <Text style={[styles.monthLabel, textStyle]}>
            { (this.props.months || MONTHS)[this.state.selectedMonth] } { this.props.year }
          </Text>
        </View>
        <View style={styles.monthSelector}>
          {next}
        </View>

      </View>
    )
  }
}

type Props = {
  maxDate: Date,
  minDate: Date,
  fromDate: Date,
  toDate: Date,
  selectedDate: Date,
  onDateChange: Function,
  screenWidth: number,
  startFromMonday: boolean,
  weekdays: Array<string>,
  months: Array<number>,
  previousTitle: string,
  nextTitle: string,
  selectedDayColor: string,
  selectedDayTextColor: string,
  scaleFactor: number,
  textStyle: Style,
  highlightToday: boolean,
  allowRangeSelection: boolean,
}

class CalendarPicker extends Component {
  props: Props

  static defaultProps = {
    onDateChange() {},
    highlightToday: true,
  }

  constructor(props: Props) {
    super(props)

    if (this.props.scaleFactor !== undefined) {
      styles = StyleSheet.create(makeStyles(this.props.scaleFactor))
    }

    let startDate = this.props.selectedDate
    if (this.props.allowRangeSelection && this.props.fromDate) { startDate = this.props.fromDate }

    this.state = {
      fromDate: this.props.fromDate,
      toDate: this.props.toDate,
      today: new Date(),
      date: startDate,
      day: startDate.getDate(),
      month: startDate.getMonth(),
      year: startDate.getFullYear(),
      selectedDay: [],
    }
  }

  // Trigger date change if new props are provided.
  // Typically, when selectedDate is changed programmatically.
  //
  componentWillReceiveProps(newProps) {
    let startDate = newProps.selectedDate
    if (newProps.allowRangeSelection && newProps.fromDate) { startDate = newProps.fromDate }

    this.setState({
      fromDate: newProps.fromDate,
      toDate: newProps.toDate,
      date: startDate,
      day: startDate.getDate(),
      month: startDate.getMonth(),
      year: startDate.getFullYear(),
    })
  }

  onDayChange(day) {
    this.setState({day: day.day}, () => { this.onDateChange() })
  }

  onMonthChange(month) {
    this.setState({month}, () => { this.onDateChange() })
  }

  getNextYear() {
    this.setState({year: this.state.year + 1}, () => { this.onDateChange() })
  }

  getPrevYear() {
    this.setState({year: this.state.year - 1}, () => { this.onDateChange() })
  }

  onDateChange() {
    let {
      day,
      month,
      year,
    } = this.state,
      date = new Date(year, month, day)

    if (!this.props.allowRangeSelection) {
      this.setState({date})
      this.props.onDateChange(date)
    } else {
      let fromDate = this.state.fromDate,
        toDate = this.state.toDate
      if (!fromDate) {
        fromDate = date
      } else if (!toDate) {
        if (date > fromDate) {
          toDate = date
        } else {
          fromDate = date
        }
      } else if (fromDate && toDate) {
        fromDate = date
        toDate = null
      }
      this.setState({fromDate, toDate})
      this.props.onDateChange({start_date: fromDate, end_date: toDate})
    }
  }

  render() {
    return (
      <View style={styles.calendar}>
        <HeaderControls
          maxDate={this.props.maxDate}
          minDate={this.props.minDate}
          year={this.state.year}
          month={this.state.month}
          onMonthChange={this.onMonthChange}
          getNextYear={this.getNextYear}
          getPrevYear={this.getPrevYear}
          months={this.props.months}
          previousTitle={this.props.previousTitle}
          nextTitle={this.props.nextTitle}
          textStyle={this.props.textStyle}
        />

        <WeekDaysLabels
          screenWidth={this.props.screenWidth}
          weekdays={this.props.weekdays}
          textStyle={this.props.textStyle}
        />

        <Days
          maxDate={this.props.maxDate}
          minDate={this.props.minDate}
          fromDate={this.state.fromDate}
          toDate={this.state.toDate}
          month={this.state.month}
          year={this.state.year}
          date={this.state.date}
          today={this.state.today}
          highlightToday={this.props.highlightToday}
          onDayChange={this.onDayChange}
          screenWidth={this.props.screenWidth}
          startFromMonday={this.props.startFromMonday}
          selectedDayColor={this.props.selectedDayColor}
          selectedDayTextColor={this.props.selectedDayTextColor}
          textStyle={this.props.textStyle}
        />
      </View>
    )
  }
}

export default CalendarPicker
