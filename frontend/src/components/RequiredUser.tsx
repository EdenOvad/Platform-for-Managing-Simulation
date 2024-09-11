/* eslint-disable react/prop-types */
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequiredUser = () => {

    const accessToken = localStorage.getItem('token');

    const location = useLocation();

    if (accessToken && accessToken !== 'null') {
        return <Outlet />;
    } else {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
};

export default RequiredUser;
