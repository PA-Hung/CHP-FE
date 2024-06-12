import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getBooking } from '@/utils/api';

export const fetchBooking = createAsyncThunk(
    'booking/fetchBooking',
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

export const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        bookingOnchangeTable: (state, action) => {
            state.meta = action.payload
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchBooking.pending, (state, action) => {
            // Add user to the state array
            state.isFetching = true;
        })
        builder.addCase(fetchBooking.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }

        })
        builder.addCase(fetchBooking.rejected, (state, action) => {
            // Add user to the state array
            state.isFetching = false;
        })
    },
})

// Action creators are generated for each case reducer function

export const { bookingOnchangeTable } = bookingSlice.actions
export default bookingSlice.reducer