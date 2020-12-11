import 'normalize.css'
import "styles/material-dashboard-react.css";
import './index.scss';

declare global {
    const log: typeof console.log;
    const env: 'production' | 'development';
    const qok: boolean;
}

(window as any).global = window;
const g: any = (global || window);
g.env = global.process ? 'development' : null;

const glob = {
    log: console.log,
    qok: g.env === 'development',
    env: g.env,
}
Object.assign(window, glob);
// -- INITIALIZER -- //

import * as React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, Redirect } from "react-router-dom";
// import Sessions from './views/Sessions';
import { browserHist } from './data/store';
import Dasboard from './views/Dashboard';
import type { NavButton } from './components/Navbar/Navbar';
import Navbar from 'src/components/Navbar/Navbar';

const leftLinks: NavButton[] = [{
    icon: 'PowerSettings',
    // active: false,
    // loading: true,
    // title: 'Connect'
    // disabled: true,
}, {
    icon: 'PlayArrow',
    // active: true,
    // disabled: false,
    // title: 'Play'
}, {
    icon: 'StopSharp',
    // active: false,
    // disabled: false,
    // title: 'Stop'
}];

const rightLinks: NavButton[] = [{
    title: 'Save CSV',
    // loading: true
}, {
    title: 'Set BandPass',
    // icon: 'PlayArrow',
}, {
    title: 'Set Channel View'
}, {
    title: 'Set Tags'
}, {
    title: 'Settings'
}];

!(async function() { // workaround to work with quokka.js
    if (!g.env) (window as any).env = (await import('./env')).env.MODE;
    ReactDOM.render(<>
        <Navbar
            brand="Web-BCI"
            rightMenuBtns={leftLinks}
            topMenuBtns={rightLinks}
        />
        <Router history={browserHist}>
            <Switch>
                <Route path="/dashboard" component={Dasboard} />
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
