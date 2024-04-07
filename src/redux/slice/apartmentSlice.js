import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getApartment } from '@/utils/api';

export const fetchApartment = createAsyncThunk(
    'apartment/fetchApartment',
    async ({ query }) => {
        const response = await getApartment(query);
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

export const apartmentSlice = createSlice({
    name: 'apartment',
    initialState,
    reducers: {
        apartmentOnchangeTable: (state, action) => {
            state.meta = action.payload
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchApartment.pending, (state, action) => {
            // Add user to the state array
            state.isFetching = true;
        })
        builder.addCase(fetchApartment.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }

        })
        builder.addCase(fetchApartment.rejected, (state, action) => {
            // Add user to the state array
            state.isFetching = false;
        })
    },
})

// Action creators are generated for each case reducer function

export const { apartmentOnchangeTable } = apartmentSlice.actions
export default apartmentSlice.reducer