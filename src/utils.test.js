import moment from 'moment'
import {
  getListSizeClass,
  getLongDateFormat,
  pascalToString,
  isWithinLastYear,
  isWithinLastWeek,
  getCurrentShift,
  isAfterToday,
  forenameToInitial,
} from './utils'

describe('getListSizeClass()', () => {
  it('should return empty-list if no list provided', () => {
    expect(getListSizeClass()).toEqual('empty-list')
  })

  it('should return empty-list if provided array is empty', () => {
    const list = []
    expect(getListSizeClass(list)).toEqual('empty-list')
  })

  it('should return small-list if provided array has less than 20 entries', () => {
    const list = new Array(19)
    expect(getListSizeClass(list)).toEqual('small-list')
  })

  it('should return medium-list if provided array has less than 40 entries', () => {
    const list = new Array(29)
    expect(getListSizeClass(list)).toEqual('medium-list')
  })

  it('should return large-list if provided array has 40 or more entries', () => {
    const list = new Array(39)
    expect(getListSizeClass(list)).toEqual('large-list')
  })

  it('should return extra-large-list if provided array has 40 or more entries', () => {
    const list = new Array(40)
    expect(getListSizeClass(list)).toEqual('extra-large-list')
  })
})

describe('getLongDateFormat()', () => {
  it('should return Todays date in the long format by default', () => {
    const todaysLongDate = moment().format('dddd Do MMMM')

    expect(getLongDateFormat()).toEqual(todaysLongDate)
    expect(getLongDateFormat('Today')).toEqual(todaysLongDate)
  })

  it('should return the provided date in the desired long format starting with day name', () => {
    expect(getLongDateFormat('28/11/2018')).toEqual('Wednesday 28th November')
  })
})

describe('pascalToString()', () => {
  it('should return a correctly formatted string', () => {
    expect(pascalToString('PascalCasedString')).toEqual('Pascal cased string')
  })
})

describe('isWithinLastYear()', () => {
  Date.now = jest.fn(() => new Date(Date.UTC(2019, 0, 13)).valueOf())

  it('returns true if date is "Today"', () => {
    expect(isWithinLastYear('Today')).toBe(true)
  })

  it('returns true if date is within the past year', () => {
    expect(isWithinLastYear('13/01/2018')).toBe(true)
  })

  it('returns false if date is not within the past year', () => {
    expect(isWithinLastYear('12/01/2018')).toBe(false)
  })
})

describe('isWithinLastWeek()', () => {
  Date.now = jest.fn(() => new Date(Date.UTC(2019, 0, 13)).valueOf())

  it('returns true if date is "Today"', () => {
    expect(isWithinLastWeek('Today')).toBe(true)
  })

  it('returns true if date is within the past week', () => {
    expect(isWithinLastWeek('8/01/2019')).toBe(true)
  })

  it('returns false if date is not within the past week', () => {
    expect(isWithinLastWeek('2/01/2019')).toBe(false)
  })
})

describe('getCurrentShift()', () => {
  it('returns AM if time is post midnight', () => {
    expect(getCurrentShift('2019-08-11T00:00:01.000')).toEqual('AM')
  })

  it('returns AM if time is pre 12 noon', () => {
    expect(getCurrentShift('2019-08-11T11:59:59.000')).toEqual('AM')
  })

  it('returns PM if time is post 12 noon and before 5PM', () => {
    expect(getCurrentShift('2019-08-11T16:59:59.000')).toEqual('PM')
  })

  it('returns ED if time is post 5pm and before midnight', () => {
    expect(getCurrentShift('2019-08-11T23:59:59.000')).toEqual('ED')
  })
})

describe('isAfterToday()', () => {
  Date.now = jest.fn(() => new Date(Date.UTC(2019, 0, 13)).valueOf())

  it('returns false if date is "Today"', () => {
    expect(isAfterToday('Today')).toBe(false)
  })

  it('returns false if date is within the past week', () => {
    expect(isAfterToday('2/01/2019')).toBe(false)
  })

  it('returns true if date is AFTER day', () => {
    expect(isAfterToday('14/01/2019')).toBe(true)
  })

  it('returns true if date is within the next week', () => {
    expect(isAfterToday('19/01/2019')).toBe(true)
  })
})

describe('forenameToInitial()', () => {
  it('should return a correctly formatted name', () => {
    expect(forenameToInitial('Test User')).toEqual('T User')
  })
})
