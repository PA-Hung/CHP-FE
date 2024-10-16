export const ALL_PERMISSIONS = {
    PERMISSIONS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        CREATE: { method: "POST", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/permissions/:id', module: "PERMISSIONS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/permissions/:id', module: "PERMISSIONS" },
    },
    ROLES: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/roles', module: "ROLES" },
        CREATE: { method: "POST", apiPath: '/api/v1/roles', module: "ROLES" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/roles/:id', module: "ROLES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/roles/:id', module: "ROLES" },
    },
    USERS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/users', module: "USERS" },
        CREATE: { method: "POST", apiPath: '/api/v1/users', module: "USERS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/users/:id', module: "USERS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/users/:id', module: "USERS" },
    },
    DASHBOARD: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/accommodation/dashboard', module: "DASHBOARD" },
    },
    APARTMENT: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/apartment', module: "APARTMENT" },
        CREATE: { method: "POST", apiPath: '/api/v1/apartment', module: "APARTMENT" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/apartment/:id', module: "APARTMENT" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/apartment/:id', module: "APARTMENT" },
    },
    ACCOMMODATION: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/accommodation', module: "ACCOMMODATION" },
        CREATE: { method: "POST", apiPath: '/api/v1/accommodation', module: "ACCOMMODATION" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/accommodation/:id', module: "ACCOMMODATION" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/accommodation/:id', module: "ACCOMMODATION" },
    },
    EXCEL: {
        IMPORT: { method: "IMPORT", apiPath: '/api/v1/excel/import', module: "EXCEL" },
        EXPORT: { method: "EXPORT", apiPath: '/api/v1/excel/export', module: "EXCEL" },
    },
    // ----------------
    BOOKINGS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/bookings', module: "BOOKINGS" },
        CREATE: { method: "POST", apiPath: '/api/v1/bookings', module: "BOOKINGS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/bookings/:id', module: "BOOKINGS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/bookings/:id', module: "BOOKINGS" },
        GET_PAYMENT: { method: "GET", apiPath: '/api/v1/payments', module: "BOOKINGS" },
        CREATE_PAYMENT: { method: "POST", apiPath: '/api/v1/payments', module: "BOOKINGS" },
        OPEN_PAYMENT: { method: "POST", apiPath: '/api/v1/payments/open', module: "BOOKINGS" },
        UPDATE_PAYMENT: { method: "PATCH", apiPath: '/api/v1/payments/:id', module: "BOOKINGS" },
        DELETE_PAYMENT: { method: "DELETE", apiPath: '/api/v1/payments/:id', module: "BOOKINGS" },
    },
    MOTORS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/motors', module: "MOTORS" },
        CREATE: { method: "POST", apiPath: '/api/v1/motors', module: "MOTORS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/motors/:id', module: "MOTORS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/motors/:id', module: "MOTORS" },
    },
    GUESTS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/guests', module: "GUESTS" },
        CREATE: { method: "POST", apiPath: '/api/v1/guests', module: "GUESTS" },
        UPDATE: { method: "PATCH", apiPath: '/api/v1/guests/:id', module: "GUESTS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/guests/:id', module: "GUESTS" },
    },
}

export const ALL_MODULES = [
    { value: "GET", label: "GET" },
    { value: "POST", label: "POST" },
    { value: "PUT", label: "PUT" },
    { value: "PATCH", label: "PATCH" },
    { value: "DELETE", label: "DELETE" },
    { value: "IMPORT", label: "IMPORT" },
    { value: "EXPORT", label: "EXPORT" },
]
