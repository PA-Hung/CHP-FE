import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getMaintenances } from '@/utils/api';

export const fetchMaintenances = createAsyncThunk(
    'maintenance/fetchMaintenances',
    async ({ query }) => {
        const response = await getMaintenances(query);
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

export const maintenanceSlice = createSlice({
    name: 'maintenance',
    initialState,
    reducers: {
        maintenanceOnchangeTable: (state, action) => {
            state.meta = action.payload
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchMaintenances.pending, (state, action) => {
            // Add user to the state array
            state.isFetching = true;
        })
        builder.addCase(fetchMaintenances.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }

        })
        builder.addCase(fetchMaintenances.rejected, (state, action) => {
            // Add user to the state array
            state.isFetching = false;
        })
    },
})

// Action creators are generated for each case reducer function

export const { maintenanceOnchangeTable } = maintenanceSlice.actions
export default maintenanceSlice.reducer