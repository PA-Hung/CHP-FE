import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getPayment } from '@/utils/api';

export const fetchPayment = createAsyncThunk(
    'payment/fetchPayment',
    async ({ query }) => {
        const response = await getPayment(query);
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

export const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        paymentOnchangeTable: (state, action) => {
            state.meta = action.payload
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchPayment.pending, (state, action) => {
            // Add user to the state array
            state.isFetching = true;
        })
        builder.addCase(fetchPayment.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }

        })
        builder.addCase(fetchPayment.rejected, (state, action) => {
            // Add user to the state array
            state.isFetching = false;
        })
    },
})

// Action creators are generated for each case reducer function

export const { paymentOnchangeTable } = paymentSlice.actions
export default paymentSlice.reducer