import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { selectUser, selectToken } from "../features/authSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const RequireAuthAsUser = () => {
    const location = useLocation()
    const token = useSelector(selectToken);
    const navigate = useNavigate();

    if (!token){
        return <Navigate to="/login" state={{from: location}} replace />
    }

    const user = useSelector(selectUser);

    if (user?.email_verified === false) {
            return <Navigate to="/otp" state={{ from: 'dashboard' }} replace />
        }
        if (user?.email_verified === false) {
            return <Navigate to="/otp" state={{ from: 'dashboard' }} replace />
        }
        if (!user || user.is_admin === true) {
            return <Navigate to="/login" state={{ from: location }} replace />
        }
    return <Outlet />;
}

const RequireAuthAsAdmin = () => {
    const location = useLocation()
    const token = useSelector(selectToken);
    if (!token){
        return <Navigate to="/login" state={{from: location}} replace />
    }

    const user = useSelector(selectUser);
    if (!user || user.is_admin === false) {
        return <Navigate to="/login" state={{from: location}} replace />
    }
    return <Outlet />;
}

export { RequireAuthAsUser, RequireAuthAsAdmin };

