import { getTokenFromLocalStorage } from './tokenStorageService';
import { logoutByUnauthorized } from './authentication';

export function getParametersString(name, params) {
    let pharam = [];
    for (let i = 0; i < params.length; i++) {
        pharam.push(`${name}[]=${params[i]}`);
    }

    return pharam.join('&');
}

export function apiCall(url, params = { method: 'GET' }, withAuth = true) {
    params['headers'] = params['headers'] || {};
    if (withAuth) {
        params.headers['Authorization'] = `Bearer ${getTokenFromLocalStorage()}`;
    }

    return new Promise((resolve, reject) => {
        fetch(url, params)
            .then(res => {
                if (!res.ok) {
                    if (res.status === 401) {
                        return logoutByUnauthorized();
                    } else {
                        throw res;
                    }
                }

                return res.json();
            })
            .then(res => resolve(res), err => reject(err));
    });
}
