import {SET_ALL_COMPANY_TICKERS_AND_NAMES} from '../constants/action-types'

const rootReducer = (state, action) => {
  switch (action.type){
    case SET_ALL_COMPANY_TICKERS_AND_NAMES:
      return {...state, companyTickersAndNames: action.payload }
    default:
      return state
  }
}
export default rootReducer;