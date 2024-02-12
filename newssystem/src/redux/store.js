import { legacy_createStore as createStore, combineReducers } from "redux"
import { CollApsedReducer } from "./reducers/CollapsedReducer"
import { LoadingReducer } from "./reducers/LoadingReducer"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
const reducer = combineReducers({
    CollApsedReducer,
    LoadingReducer,
})

const persistConfig = {
    key: 'kerwin',
    storage,
    whitelist:['CollApsedReducer']
    // blacklist:['CollApsedReducer']
}

const persistedReducer = persistReducer(persistConfig,reducer)
const store = createStore(persistedReducer)
const persistor = persistStore(store)
export {store,persistor}

/**
 * redux
 * store.dispatch()
 * 发布到reducer进行处理，处理后返回给
 * store新状态
 * store.subscribe()
 * 接收到新状态后订阅相关状态的就启动了
 * 
 * 
 * react-redux
 * 利用高阶组件
 * 进行自动的store引入
 * provider包围根组件 引入store作为供应商
 * connect包围要用的组件 不管你是发布还是订阅，全都在props里面
*/