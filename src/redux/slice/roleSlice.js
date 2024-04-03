import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getRole, getRoleById } from '../../utils/api'

// First, create the thunk
export const fetchRole = createAsyncThunk(
    'role/fetchRole',
    async ({ query }) => {
        const response = await getRole(query);
        return response;
    }
)

export const fetchRoleById = createAsyncThunk(
    'role/fetchRoleById',
    async (id) => {
        const response = await getRoleById(id);
        return response;
    }
)

const initialState = {
    isFetching: true,
    isFetchSingle: true,
    meta: {
        current: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    },
    result: [],
    singleRole: {
        _id: "",
        name: "",
        description: "",
        isActive: false,
        permissions: []
    }
}

export const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        resetSingleRole: (state, action) => {
            state.singleRole = {
                _id: "",
                name: "",
                description: "",
                isActive: false,
                permissions: []
            }
        },
        roleOnchangeTable: (state, action) => {
            state.meta = action.payload
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchRole.pending, (state, action) => {
            // Add user to the state array
            state.isFetching = true;
        })
        builder.addCase(fetchRole.fulfilled, (state, action) => {
            // Add user to the state array
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        })
        builder.addCase(fetchRole.rejected, (state, action) => {
            // Add user to the state array
            state.isFetching = false;
        })

        builder.addCase(fetchRoleById.pending, (state, action) => {
            state.isFetchSingle = true;
            state.singleRole = {
                _id: "",
                name: "",
                description: "",
                isActive: false,
                permissions: []
            }
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchRoleById.rejected, (state, action) => {
            state.isFetchSingle = false;
            state.singleRole = {
                _id: "",
                name: "",
                description: "",
                isActive: false,
                permissions: []
            }
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchRoleById.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetchSingle = false;
                state.singleRole = action.payload.data;
            }
        })
    },
})

// Action creators are generated for each case reducer function
export const { resetSingleRole, roleOnchangeTable } = roleSlice.actions
export default roleSlice.reducer