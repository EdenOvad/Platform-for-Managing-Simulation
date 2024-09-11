export const getToken = (): any => {
    return localStorage.getItem('token');
};

export const getUserData = (): any => {
    return localStorage.getItem('userData') || null;
};

export const removeToken = (): void => {
    localStorage.removeItem('token');
};

export const setToken = (val: string): void => {
    localStorage.setItem('token', val);
};

export const setUserData = (val: string): void => {
    localStorage.setItem('userData', val);
};

export const removeUserData = (): void => {
    localStorage.removeItem('userData');
};

