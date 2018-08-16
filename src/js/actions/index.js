import { SET_ALL_COMPANY_TICKERS_AND_NAMES } from '../constants/action-types'
import { SELECT_TARGET_COMPANY } from '../constants/action-types'
import { SET_CHART_INSTANCE } from '../constants/action-types'
import { SELECT_TIME_RANGE } from '../constants/action-types'

export const setAllCompanyTickersAndNames = companyTickersAndNames => ({ type: SET_ALL_COMPANY_TICKERS_AND_NAMES, payload: companyTickersAndNames })
export const selectTargetCompany = targetCompany => ({ type: SELECT_TARGET_COMPANY, payload: targetCompany })
export const setChartInstance = chartInstance => ({ type: SET_CHART_INSTANCE, payload: chartInstance })
export const selectTimeRange = timeRange => ({ type: SELECT_TIME_RANGE, payload: timeRange })
