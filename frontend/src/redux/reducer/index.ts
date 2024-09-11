import { LOGIN, LOGOUT } from "../action/action"
import { jwtDecode } from "jwt-decode"

interface Auth {
    user_id: string
    user_name: string
}

interface CounterState {
    user_id: string
    user_name: string
}

const token = localStorage.getItem('token');
let decodedData: Auth | null = null;

if (token) {
    decodedData = jwtDecode<Auth>(token);
}
// Define the initial state using that type
const initialState: CounterState = {
    user_id: decodedData ? decodedData.user_id : "",
    user_name: decodedData ? decodedData.user_name : "",
}

export const auth = (state = initialState, action: { type: string, payload: any }) => {
    switch (action.type) {
        case LOGIN:
            const decoded = jwtDecode(action.payload) as Auth || null

            return {
                ...state,
                user_id: decoded.user_id,
                user_name: decoded.user_name
            }
        case LOGOUT:
            localStorage.removeItem("token")
            return state = { user_id: "", user_name: "" }
        default:
            return state
    }
}