import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAccommodation } from '@/utils/api'

export const fetchAccommodation = createAsyncThunk(
    'accommodation/fetchAccommodation',
    async ({ query }) => {
        const response = await getAccommodation(query);
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

export const accommodationSlice = createSlice({
    name: 'accommodation',
    initialState,
    reducers: {
        accommodationOnchangeTable: (state, action) => {
            state.meta = action.payload
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchAccommodation.pending, (state, action) => {
            // Add user to the state array
            state.isFetching = true;
        })
        builder.addCase(fetchAccommodation.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }

        })
        builder.addCase(fetchAccommodation.rejected, (state, action) => {
            // Add user to the state array
            state.isFetching = false;
        })
    },
})

// Action creators are generated for each case reducer function

export const { accommodationOnchangeTable } = accommodationSlice.actions
export default accommodationSlice.reducer