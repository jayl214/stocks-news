import store from "../js/store/index"
import { setAllCompanyTickersAndNames } from "../js/actions/index"
import { selectTargetCompany } from "../js/actions/index"
import { setChartInstance } from "../js/actions/index"
import { selectTimeRange } from "../js/actions/index"

window.store = store
window.setAllCompanyTickersAndNames = setAllCompanyTickersAndNames
window.selectTargetCompany = selectTargetCompany
window.setChartInstance = setChartInstance
window.selectTimeRange = selectTimeRange