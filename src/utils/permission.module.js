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
