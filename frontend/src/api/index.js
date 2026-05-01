import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Employee APIs
export const employeeAPI = {
    getAll: () => api.get('/api/employees'),
    getOne: (employeeId) => api.get(`/api/employees/${employeeId}`),
    create: (data) => api.post('/api/employees', data),
    delete: (employeeId) => api.delete(`/api/employees/${employeeId}`),
};

// Attendance APIs
export const attendanceAPI = {
    getAll: (startDate, endDate) => {
        let url = '/api/attendance';
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (params.toString()) url += `?${params.toString()}`;
        return api.get(url);
    },
    getByEmployee: (employeeId, startDate, endDate) => {
        let url = `/api/attendance/employee/${employeeId}`;
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (params.toString()) url += `?${params.toString()}`;
        return api.get(url);
    },
    getStats: (employeeId) => api.get(`/api/attendance/stats/employee/${employeeId}`),
    mark: (data) => api.post('/api/attendance', data),
};

// Dashboard APIs
export const dashboardAPI = {
    getStats: () => api.get('/api/dashboard/stats'),
};

export default api;
