import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    activeKey: 'home',
    title: 'Trang chủ'
}

export const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setActiveKey: (state, action) => {
            state.activeKey = action.payload.activeKey;
            state.title = action.payload.title
        },
        setHomeKey: (state, action) => {
            state.activeKey = 'home';
            state.title = 'Trang chủ'
        },
    },
})

// Action creators are generated for each case reducer function
export const { setActiveKey, setHomeKey } = menuSlice.actions

export default menuSlice.reducer