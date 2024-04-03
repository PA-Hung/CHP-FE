import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getPermission } from '../../utils/api'

// First, create the thunk
export const fetchPermission = createAsyncThunk(
    'permission/fetchPermission',
    async ({ query }) => {
        const response = await getPermission(query);
        return response;
    }
)

const initialState = {
    isFetching: true,
    meta: {
        current: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    },
    result: []
}

export const permissionSlice = createSlice({
    name: 'permission',
    initialState,
    reducers: {
        permissionOnchangeTable: (state, action) => {
            state.meta = action.payload
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchPermission.pending, (state, action) => {
            state.isFetching = true;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchPermission.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchPermission.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
            // Add user to the state array

            // state.courseOrder = action.payload;
        })
    },
})

// Action creators are generated for each case reducer function
export const { permissionOnchangeTable } = permissionSlice.actions
export default permissionSlice.reducer