export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const REGISTER = "REGISTER";

export const login = (data: any) => {
    localStorage.setItem("token", data)
    return {
        type: LOGIN,
        payload: data
    }
}

export const logout = () => {
    return {
        type: LOGOUT
    }
}