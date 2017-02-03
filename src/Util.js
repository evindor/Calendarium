/**
 * @flow
 *
 * Calendar Picker Component
 *
 * Copyright 2016 Yahoo Inc.
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */


export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December',
]
export const MAX_ROWS = 7
export const MAX_COLUMNS = 7

export type jsMonth = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

export function getDaysInMonth(month: jsMonth, year: number) {
  const lastDayOfMonth = new Date(year, month + 1, 0)
  return lastDayOfMonth.getDate()
}
