import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ path, element }: { path: string, element: React.ReactElement }) => {
    const token = localStorage.getItem('token');

    return token ? (
        <Route path={path} element={element} />
    ) : (
        <Navigate to="/login" replace />
    );
};

export default PrivateRoute;