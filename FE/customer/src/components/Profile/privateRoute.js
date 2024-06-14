import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/authContext'
import {Route, Navigate} from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {

    const { auth } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={props =>
                auth.isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Navigate to='/login' />
                )
            }>
        </Route>
    )
}

export default PrivateRoute
