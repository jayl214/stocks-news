import {SET_ALL_COMPANY_TICKERS_AND_NAMES} from '../constants/action-types'
import {SELECT_TARGET_COMPANY} from '../constants/action-types'
import {SELECT_TIME_RANGE} from '../constants/action-types'

const rootReducer = (state, action) => {
  switch (action.type){
    case SET_ALL_COMPANY_TICKERS_AND_NAMES:
      return {...state, companyTickersAndNames: action.payload }
    case SELECT_TARGET_COMPANY:
      return {...state, targetCompany: action.payload }
    case SELECT_TIME_RANGE:
      return {...state, timeRange: action.payload }
    default:
      return state
  }
}
export default rootReducer;