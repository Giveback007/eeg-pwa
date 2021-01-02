declare global {
    const log: typeof console.log;
    const env: 'production' | 'development';
    const qok: boolean;
}

import './env'; // comment out when using quokka

(window as any).global = window;
const g: any = (global || window);
g.env = global.process ? 'development' : null;

Object.assign(window, {
    log: console.log,
    qok: g.env === 'development',
    env: g.env,
});

import 'normalize.css'
import "styles/material-dashboard-react.css";
import './index.scss';
// -- INITIALIZER -- //

import * as React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, Redirect } from "react-router-dom";
// import Sessions from './views/Sessions';
import { browserHist } from './data/store';
import Dashboard from './views/Dashboard';
import Navbar from 'src/components/Navbar/Navbar';
import Settings from './views/Settings';

!(async function() { // workaround to work with quokka.js
    if (!g.env) (window as any).env = (await import('./env')).env.MODE;
    ReactDOM.render(<>
        <Navbar
            brand="Web-BCI"
            // rightMenuBtns={leftLinks}
            // topMenuBtns={rightLinks}
        />
        <Router history={browserHist}>
            <Switch>
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/settings" component={Settings} />
                <Redirect from="/" to="/dashboard" />
            </Switch>
        </Router></>,
        document.getElementById('root')
    );
})();



if (env === 'development') {
    // -- Run in DEV only -- //
}

if (env === 'production') {
    // -- Run in PROD only -- //
}

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
// if (import.meta.hot)
import.meta.hot?.accept();
