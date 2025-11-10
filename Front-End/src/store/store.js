import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import assessmentReducer from './slices/assessmentSlice';
import recommendationsReducer from './slices/recommendationsSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        assessment: assessmentReducer,
        recommendations: recommendationsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
