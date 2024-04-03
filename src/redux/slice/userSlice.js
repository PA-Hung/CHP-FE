import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUsers } from '../../utils/api'

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async ({ query }) => {
        const response = await getUsers(query);
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

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userOnchangeTable: (state, action) => {
            state.meta = action.payload
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchUser.pending, (state, action) => {
            // Add user to the state array
            state.isFetching = true;
        })
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }

        })
        builder.addCase(fetchUser.rejected, (state, action) => {
            // Add user to the state array
            state.isFetching = false;
        })
    },
})

// Action creators are generated for each case reducer function

export const { userOnchangeTable } = userSlice.actions
export default userSlice.reducer