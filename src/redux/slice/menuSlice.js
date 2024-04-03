import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    activeKey: 'home',
    title: 'Home Admin'
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
            state.title = 'Home Admin'
        },
    },
})

// Action creators are generated for each case reducer function
export const { setActiveKey, setHomeKey } = menuSlice.actions

export default menuSlice.reducer