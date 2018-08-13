import { SET_ALL_COMPANY_TICKERS_AND_NAMES } from '../constants/action-types'
import { SELECT_TARGET_COMPANY } from '../constants/action-types'
import { SELECT_TIME_RANGE } from '../constants/action-types'

export const setAllCompanyTickersAndNames = companyTickersAndNames => ({ type: SET_ALL_COMPANY_TICKERS_AND_NAMES, payload: companyTickersAndNames })
export const selectTargetCompany = targetCompany => ({ type: selectTargetCompany, payload: targetCompany })
export const selectTimeRange = timeRange => ({ type: SELECT_TIME_RANGE, payload: timeRange })
