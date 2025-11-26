import api from './axios.js';

export function fetchRejections(params = {}) {
    return api.get('/string-rejections', { params });
}

export function createRejection(data) {
    return api.post('/string-rejections', data);
}
