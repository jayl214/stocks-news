import { createStore } from "redux";
import rootReducer from "../reducers/index";


const initialState = {
  // targetCompany:{
  //     name: '',
  //     ticker: ''
  //   },
  // targetTicker: '',
  // targetName: '',
  // articleList: [],
  // appjs: this
  // // chartInstance: {},
  // searchbarSuggestions: [],
  companyTickersAndNames: [],
  timeRange: '',
};

const enhancer = window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__();

if (!enhancer) {
  console.warn('Install Redux DevTools Extension to inspect the app state: ' +
    'https://github.com/zalmoxisus/redux-devtools-extension#installation')
}

const store = createStore(rootReducer, initialState, enhancer)

export default store;