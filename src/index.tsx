const { env } = import.meta;
import './initializer';
// INITIALIZED //

import 'normalize.css'
import "assets/css/material-dashboard-react.css";
import './index.scss';

import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import Dashboard from './views/Dasboard';

if (env.MODE === 'development') {
    // -- Run in DEV only -- //
}

if (env.MODE === 'production') {
    // -- Run in PROD only -- //
}

const hist = createBrowserHistory();
ReactDOM.render(
    <Router history={hist}>
        <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Redirect from="/" to="/dashboard" />
        </Switch>
    </Router>,
    document.getElementById('root')
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
// if (import.meta.hot)
import.meta.hot?.accept();
