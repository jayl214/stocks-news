import { createStore } from "redux";
import rootReducer from "../reducers/index";


// const initialState = {
//   targetCompany:{
//       name: '',
//       symbol: ''
//     },
//   // articleList: [],
//   // appjs: this
//   chartInstance: {},
//   // searchbarSuggestions: [],
//   companyTickersAndNames: [],
//   timeRange: '1m',
// };

const enhancer = window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__();

if (!enhancer) {
  console.warn('Install Redux DevTools Extension to inspect the app state: ' +
    'https://github.com/zalmoxisus/redux-devtools-extension#installation')
}

const store = createStore(rootReducer, enhancer)

export default store;