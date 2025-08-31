import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './slice/authSlice'
import friendReducer from './slice/friendSlice'
import chatReducer from './slice/chatSlice'
import postReducer from './slice/postSlice'
import { ImOffice } from 'react-icons/im'
import commentReducer from './slice/commentSlice'
import usersReducer from './slice/userSlice'
import notificationReducer from './slice/notificationSlice'
import adminPostReducer from './slice/adminPostSlice'

const persistConfig = {
  key: 'auth',
  version: 1,
  storage,
  whitelist: ['auth']
}

const rootReducer = combineReducers({
  auth: authReducer,
  friend: friendReducer,
  chat:chatReducer,
  post:postReducer,
  user:usersReducer,
  comment:commentReducer,
  notification:notificationReducer,
  adminPost:adminPostReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export let persistor = persistStore(store)
