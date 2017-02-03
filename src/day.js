// @flow

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

import makeStyles from './makeStyles'

// The styles in makeStyles are intially scaled to this width
const IPHONE6_WIDTH = 375
const initialScale = Dimensions.get('window').width / IPHONE6_WIDTH
const styles = StyleSheet.create(makeStyles(initialScale))

type Props = {
  date: Date,
  onDayChange: Function,
  maxDate: Date,
  minDate: Date,
  selected?: boolean,
  type?: string,
  day: number | string,
  screenWidth: number,
  startFromMonday?: boolean,
  selectedDayColor?: string,
  selectedDayTextColor?: string,
  textStyle?: Style,
  highlightToday?: boolean,
  today?: Date,
}

export default class Day extends Component {
  props: Props

  DAY_WIDTH: number
  SELECTED_DAY_WIDTH: number
  BORDER_RADIUS: number

  constructor(props: Props) {
    super(props)
    this.DAY_WIDTH = (this.props.screenWidth - 16) / 7
    this.SELECTED_DAY_WIDTH = ((this.props.screenWidth - 16) / 7) - 10
    this.BORDER_RADIUS = this.SELECTED_DAY_WIDTH / 2

    // this.state = {
    //   DAY_WIDTH,
    //   SELECTED_DAY_WIDTH,
    //   BORDER_RADIUS,
    // }
  }

  render() {
    const textStyle = this.props.textStyle
    const todayStyle = this.props.highlightToday ? styles.today : {}

    let selectedWrapperStyle = styles.dayWrapper
    if (this.props.type === 'start_range') {
      selectedWrapperStyle = styles.startDayWrapper
    } else if (this.props.type === 'end_range') {
      selectedWrapperStyle = styles.endDayWrapper
    }

    if (this.props.selected) {
      const selectedDayColorStyle = this.props.selectedDayColor
            ? {backgroundColor: this.props.selectedDayColor}
            : {}

      const selectedDayTextColorStyle = this.props.selectedDayTextColor
            ? {color: this.props.selectedDayTextColor}
            : {}

      const dayWrapperStyle = this.props.type === 'in_range'
            || this.props.type === 'start_range'
            || this.props.type === 'end_range' ? selectedDayColorStyle : {}

      return (
        <View style={[selectedWrapperStyle, dayWrapperStyle]}>
          <View style={[styles.dayButtonSelected, selectedDayColorStyle]}>
            <TouchableOpacity
              style={styles.dayButton}
              onPress={() => this.props.onDayChange(this.props.day)}
            >
              <Text
                style={[
                  styles.dayLabel,
                  textStyle,
                  selectedDayTextColorStyle,
                ]}
              >
                {this.props.day}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else if (this.props.date < this.props.minDate
               || this.props.date > this.props.maxDate) {
      return (
        <View style={[styles.dayWrapper, todayStyle]}>
          <Text style={[styles.dayLabel, textStyle, styles.disabledTextColor]}>
            {this.props.day}
          </Text>
        </View>
      )
    }

    return (
      <View style={[styles.dayWrapper, todayStyle]}>
        <TouchableOpacity
          style={styles.dayButton}
          onPress={() => this.props.onDayChange(this.props.day)}
        >
          <Text style={[styles.dayLabel, textStyle]}>
            {this.props.day}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

