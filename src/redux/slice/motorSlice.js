import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getMotor } from '@/utils/api';

export const fetchMotor = createAsyncThunk(
    'motor/fetchMotor',
    async ({ query }) => {
        const response = await getMotor(query);
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

export const motorSlice = createSlice({
    name: 'motor',
    initialState,
    reducers: {
        motorOnchangeTable: (state, action) => {
            state.meta = action.payload
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchMotor.pending, (state, action) => {
            // Add user to the state array
            state.isFetching = true;
        })
        builder.addCase(fetchMotor.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }

        })
        builder.addCase(fetchMotor.rejected, (state, action) => {
            // Add user to the state array
            state.isFetching = false;
        })
    },
})

// Action creators are generated for each case reducer function

export const { motorOnchangeTable } = motorSlice.actions
export default motorSlice.reducer