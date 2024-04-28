import axios from '@/utils/axiosCustomize'

// dashboard    ------------------------------------
export const getDashboard = (query) => {
    return axios.get(`api/v1/accommodation/dashboard?${query}`)
}

// accommodation - By Admin 
export const postCreateAccommodation = (data) => {
    return axios.post('api/v1/accommodation', data)
}

export const getAccommodation = (query) => {
    return axios.get(`api/v1/accommodation?${query}`)
}

export const deleteAccommodation = (id) => {
    return axios.delete(`api/v1/accommodation/${id}`)
}

export const updateAccommodation = (data) => {
    return axios.patch('api/v1/accommodation', data)
}

// Apartment ------------------------------------
export const postApartment = (data) => {
    return axios.post('api/v1/apartment', data)
}

export const getApartment = (query) => {
    return axios.get(`api/v1/apartment?${query}`)
}

export const deleteApartment = (id) => {
    return axios.delete(`api/v1/apartment/${id}`)
}

export const updateApartment = (data) => {
    return axios.patch('api/v1/apartment', data)
}

// import/export Excel
export const importExcel = (fileExcel, apartmentId) => {
    const formData = new FormData();
    formData.append("fileExcel", fileExcel);
    formData.append("apartmentId", apartmentId);
    return axios({
        method: 'post',
        url: '/api/v1/excel/import',
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}

export const exportExcel = (apartmentId) => {
    return axios.get(`api/v1/excel/export`, { params: { apartmentId } })
}

// User ----------------------------------------------------------------------------------------------------

export const getUsers = (query) => {
    return axios.get(`api/v1/users?${query}`)
}

export const postCreateUser = (data) => {
    return axios.post('api/v1/users', data)
}

export const deleteUser = (id) => {
    return axios.delete(`api/v1/users/${id}`)
}

export const updateUser = (user) => {
    return axios.patch(`/api/v1/users`, { ...user })
}

export const changePassword = (user) => {
    return axios.patch(`/api/v1/users/change-password`, { ...user })
}


// Auth ----------------------------------------------------------------------------------------------------

export const postLogin = (username, password) => {
    return axios.post('api/v1/auth/login', { username, password })
}

export const getAccount = () => {
    return axios.get('api/v1/auth/account')
}

export const postLogOut = () => {
    return axios.post('api/v1/auth/logout')
}

// Role -------------------------------------------------------------------------------

export const createRole = (data) => {
    return axios.post('api/v1/roles', data)
}

export const getRole = (query) => {
    return axios.get(`api/v1/roles?${query}`)
}

export const getRoleById = (id) => {
    return axios.get(`/api/v1/roles/${id}`);
}

export const deleteRole = (id) => {
    return axios.delete(`api/v1/roles/${id}`)
}

export const updateRole = (role, id) => {
    return axios.patch(`/api/v1/roles/${id}`, { ...role })
}

// Permissions -------------------------------------------------------------------------------

export const createPermission = (data) => {
    return axios.post('api/v1/permissions', data)
}

export const getPermission = (query) => {
    return axios.get(`api/v1/permissions?${query}`)
}

export const deletePermission = (id) => {
    return axios.delete(`api/v1/permissions/${id}`)
}

export const updatePermission = (permission, id) => {
    return axios.patch(`/api/v1/permissions/${id}`, { ...permission })
}

