const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
    constructor() {
        this.baseURL = API_URL;
    }

    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getAuthHeaders(),
                ...options.headers,
            },
        };

        // Debug log: show outgoing request (no body logging for privacy)
        try {
            console.info('API Request:', { url, method: config.method || 'GET', headers: config.headers });
        } catch (e) {
            // ignore logging errors
        }

        try {
            const response = await fetch(url, config);

            // Debug: status
            console.info('API Response status:', response.status, 'for', url);

            // Обработка ошибок авторизации
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                throw new Error('Unauthorized');
            }

            // Обработка других HTTP ошибок
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
            }

            // FastAPI возвращает JSON по умолчанию
            const data = await response.json();
            console.info('API Response JSON:', data);
            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // GET запрос
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;

        // Отправляем GET без дополнительных заголовков в options
        // request() сам добавит getAuthHeaders()
        return this.request(url, {
            method: 'GET',
        });
    }

    // POST запрос
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // PUT запрос
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // DELETE запрос
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE',
        });
    }

    // PATCH запрос
    async patch(endpoint, data) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }
}

// Экспортируем единственный экземпляр (Singleton)
const api = new ApiService();
export default api;
