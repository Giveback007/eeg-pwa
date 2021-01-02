import React, { useState } from 'react';
import classNames from 'classnames';
import { Drawer, makeStyles, AppBar, Toolbar, IconButton, Button, CircularProgress } from '@material-ui/core';
import { linker, State, store } from 'src/data/store';
import { Icon, icons } from '../icons';

import styles from "./Navbar.style";
import type { Immutable, UrlObj } from '@giveback007/browser-utils';
import { Actions } from 'src/data/actions/index.actions';

// type S = { };
type P = {
    topMenuBtns?: NavButton[];
    rightMenuBtns?: NavButton[];
    brand?: string;
} & ReturnType<typeof link>;

const useStyles = makeStyles(styles as any); //FIXME

export type NavButton = {
    icon?: Icon;
    title?: string;
    active?: boolean;
    loading?: boolean;
    disabled?: boolean;
    action?: string;
    route?: string | UrlObj;
}

function NavBtn(p: NavButton & { handleDrawerToggle?: () => void }) {
    let IC: any = p.icon ? icons[p.icon] : null;
    IC = IC ? <IC className="btn-icon" /> : null;

    const fct = () => {
        if (p.action) store.action({ type: p.action as any });
        if (p.route) store.setPath(p.route);

        if (p.handleDrawerToggle) p.handleDrawerToggle();
    }

    return (
        <Button
            disabled={p.disabled}
            className={'nav-btn ' + (p.active ? 'active' : '')}
            onClick={fct}
        >
            {p.loading ?
                <CircularProgress
                    size={20}
                    style={{color: "#8c209e"}}
                    className="btn-icon"
                /> : IC}
            {p.title || null}
        </Button>
    )
}

function Navbar(props: P) {
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = useState(() => false);
    const { navRightLinks, navLeftLinks, brand } = props;

    const handleDrawerToggle = () =>
        setMobileOpen(open => !open);

    const appBarClasses = classNames({
        [classes.appBar]: true,
        [classes.flex]: true,
        [classes.fixed]: true
    });

    const brandComponent =
        <Button
            // id="app-bar"
            onClick={() => store.setPath('/dashboard')}
            className={classes.title}
        >{brand}</Button>;

    return <>
        <div className={classes.appBarSpacer} />
        <AppBar className={appBarClasses}>
            <Toolbar className={classes.container}>
                <div className={classes.flex}>
                    {brandComponent}
                    {navLeftLinks?.map(x => NavBtn(x))}
                </div>

                <IconButton
                    color="inherit"
                    aria-label="open dashboard settings"
                    className='nav-btn-activatable'
                    onClick={Actions.TOP_OPTS_TOGGLE}
                > <icons.Tune /> </IconButton>
                <IconButton
                    color="inherit"
                    aria-label="open dashboard settings"
                    className='nav-btn-activatable'
                    style={{ cursor: 'auto', pointerEvents: 'none' }}
                > | </IconButton>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    className='nav-btn-activatable'
                    onClick={handleDrawerToggle}
                > <icons.Menu /> </IconButton>
            </Toolbar>
        </AppBar>
        <Drawer
            variant="temporary"
            anchor={"right"}
            open={mobileOpen}
            className={classes.appDrawer}
            onClose={handleDrawerToggle}
        >
            {navRightLinks?.map(x =>
                <NavBtn {...{...x, handleDrawerToggle}} />)}
        </Drawer>
    </>
}

const link = ({ navRightLinks, navLeftLinks }: Immutable<State>) => ({ navRightLinks, navLeftLinks });
export default linker(link, Navbar);
