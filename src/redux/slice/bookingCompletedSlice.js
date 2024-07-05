import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getBooking } from '@/utils/api';

export const fetchCompletedBooking = createAsyncThunk(
    'booking/fetchCompletedBooking',
    async ({ query }) => {
        const response = await getBooking(query);
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

export const bookingCompletedSlice = createSlice({
    name: 'bookingCompleted',
    initialState,
    reducers: {
        bookingCompletedOnchangeTable: (state, action) => {
            state.meta = action.payload
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchCompletedBooking.pending, (state, action) => {
            // Add user to the state array
            state.isFetching = true;
        })
        builder.addCase(fetchCompletedBooking.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }

        })
        builder.addCase(fetchCompletedBooking.rejected, (state, action) => {
            // Add user to the state array
            state.isFetching = false;
        })
    },
})

// Action creators are generated for each case reducer function

export const { bookingCompletedOnchangeTable } = bookingCompletedSlice.actions
export default bookingCompletedSlice.reducer