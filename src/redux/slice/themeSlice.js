import { createSlice } from '@reduxjs/toolkit'
import { theme } from 'antd';

const initialState = {
    themeMode: 'light',
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setThemeMode: (state, action) => {
            state.themeMode = action.payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const { setThemeMode } = themeSlice.actions

export default themeSlice.reducer