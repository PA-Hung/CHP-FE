import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getGuest } from '@/utils/api';

export const fetchGuest = createAsyncThunk(
    'guest/fetchGuest',
    async ({ query }) => {
        const response = await getGuest(query);
        return response;
    }
)

const initialState = {
    isFetching: true,
    meta: {
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    },
    result: []
}

export const guestSlice = createSlice({
    name: 'guest',
    initialState,
    reducers: {
        guestOnchangeTable: (state, action) => {
            state.meta = action.payload
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchGuest.pending, (state, action) => {
            // Add user to the state array
            state.isFetching = true;
        })
        builder.addCase(fetchGuest.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }

        })
        builder.addCase(fetchGuest.rejected, (state, action) => {
            // Add user to the state array
            state.isFetching = false;
        })
    },
})

// Action creators are generated for each case reducer function

export const { guestOnchangeTable } = guestSlice.actions
export default guestSlice.reducer