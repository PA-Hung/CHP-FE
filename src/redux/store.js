import { configureStore } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from './slice/authSlice';
import userReducer from './slice/userSlice';
import menuReducer from './slice/menuSlice';
import themeReducer from './slice/themeSlice';
import roleReducer from './slice/roleSlice';
import permissionReducer from './slice/permissionSlice';
import accommodationReducer from './slice/accommodationSlice';
import apartmentReducer from './slice/apartmentSlice';
import dashboardReducer from './slice/dashboardSlice';
import bookingReducer from './slice/bookingSlice'
import guestReducer from './slice/guestSlice'
import motorReducer from './slice/motorSlice'
import bookingCompletedReducer from './slice/bookingCompletedSlice'
import paymentReducer from './slice/paymentSlice'
import saleReducer from './slice/saleSlice'


const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    menu: menuReducer,
    theme: themeReducer,
    role: roleReducer,
    permission: permissionReducer,
    accommodation: accommodationReducer,
    apartment: apartmentReducer,
    dashboard: dashboardReducer,
    booking: bookingReducer,
    guest: guestReducer,
    motor: motorReducer,
    bookingCompleted: bookingCompletedReducer,
    payment: paymentReducer,
    sale: saleReducer
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth', 'menu'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

const persistor = persistStore(store);

export { store, persistor };
