import React, { useState } from 'react';
import classNames from 'classnames';
import { Drawer, makeStyles, AppBar, Toolbar, IconButton, Button, CircularProgress } from '@material-ui/core';
import { linker, State } from 'src/data/store';
import { Icon, icons } from '../icons';

import styles from "./Navbar.style";

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
}

function NavBtn(p: NavButton & { handleDrawerToggle?: () => void }) {
    let IC: any = p.icon ? icons[p.icon] : null;
    IC = IC ? <IC className="btn-icon" /> : null;
    // log(p.active)
    return (
        <Button
            disabled={p.disabled}
            className={'nav-btn ' + (p.active ? 'active' : '')}
            onClick={p.handleDrawerToggle}
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
    const { topMenuBtns: rightLinks, rightMenuBtns: leftLinks, brand } = props;

    const handleDrawerToggle = () =>
        setMobileOpen((open) => !open)

    const appBarClasses = classNames({
        [classes.appBar]: true,
        [classes.flex]: true,
        [classes.fixed]: true
    });

    const brandComponent =
        <Button
            id="app-bar"
            className={classes.title}
        >{brand}</Button>;

    return <>
        <div className={classes.appBarSpacer} />
        <AppBar className={appBarClasses}>
            <Toolbar className={classes.container}>
                <div className={classes.flex}>
                    {brandComponent}
                    {leftLinks?.map(x => NavBtn(x))}
                </div>

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
            {rightLinks?.map(x =>
                <>
                {/* <hr/> */}
                <NavBtn {...{...x, handleDrawerToggle}} />
                </>
            )}
        </Drawer>
    </>
}

const link = (_s: State) => ({  });
export default linker(link, Navbar);
