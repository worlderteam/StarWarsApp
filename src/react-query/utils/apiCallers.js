import axios from 'axios';

const API_HOST = 'http://localhost:3000';
const SWAPI_HOST = 'https://swapi.info/api/';
const HTTP_REQUEST_TIMEOUT = 10000;

const IS_OK = (status) => status >= 200 && status < 300;

const responseFormatter = (response) => {
    const statusCode = response.status;
    const responseContent = response.data?.data || response.data;
    const errorMessage = !IS_OK(statusCode) ? response.data?.error_message || 'Something went wrong!' : '';
    const errorCode = !IS_OK(statusCode) ? response.data?.error_code : '';

    return {
        statusCode,
        responseContent,
        errorMessage,
        errorCode,
    };
};

export const apiCaller = (isSWAPI = false) => {
    const configs = {
        baseURL: isSWAPI ? SWAPI_HOST : API_HOST,
        timeout: HTTP_REQUEST_TIMEOUT,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
        },
    };

    const instance = axios.create(configs);

    instance.interceptors.response.use(
        (response) => {
            return responseFormatter(response);
        },
        (error) => {
            const response = error.response || {};
            return Promise.reject(responseFormatter(response));
        }
    );

    return instance;
};
