import React from 'react'
import { Redirect, Route } from 'react-router-dom'

function PrivateRoute({ component: Component, valid, ...rest }) {
    return (
        <Route {...rest} render={props => (
            valid.valid ?
                <Component {...props}{...rest} valid={valid} /> :
                !valid.refreshed &&
                < Redirect to='/' />
        )} />
    )
}

export default PrivateRoute
