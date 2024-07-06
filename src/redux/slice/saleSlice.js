import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getSale } from '@/utils/api';

export const fetchSale = createAsyncThunk(
    'sale/fetchSale',
    async ({ query }) => {
        const response = await getSale(query);
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

export const saleSlice = createSlice({
    name: 'sale',
    initialState,
    reducers: {
        saleOnchangeTable: (state, action) => {
            state.meta = action.payload
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchSale.pending, (state, action) => {
            // Add user to the state array
            state.isFetching = true;
        })
        builder.addCase(fetchSale.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }

        })
        builder.addCase(fetchSale.rejected, (state, action) => {
            // Add user to the state array
            state.isFetching = false;
        })
    },
})

// Action creators are generated for each case reducer function

export const { saleOnchangeTable } = saleSlice.actions
export default saleSlice.reducer