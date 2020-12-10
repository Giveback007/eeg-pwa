import React, { useEffect, useState } from 'react';
import { Drawer, makeStyles, Button, AppBar, Toolbar, Hidden, IconButton, List, ListItem } from '@material-ui/core';

import styles from "./Navbar.style";
import { linker, State } from 'src/data/store';
import classNames from 'classnames';
import { icons } from '../icons';

// type S = { };
// type color = NotifyColors | "transparent" | "white" | "dark";
type P = {
    // color?: color
    rightLinks?: React.ReactNode;
    leftLinks?: React.ReactNode;
    brand?: string;
    // fixed?: boolean;
    // absolute?: boolean;
    // changeColorOnScroll?: { height: number; color: color };
} & ReturnType<typeof link>;

const useStyles1 = makeStyles(styles as any); //FIXME

function Navbar(props: P) {
    const classes = useStyles1();
    const [mobileOpen, setMobileOpen] = useState(() => false);

    // const color = props.color || 'white';
    let {
        rightLinks,
        leftLinks,
        // absolute, changeColorOnScroll,
        // fixed,
         brand,
    } = props;

    // leftLinks = [<div>{'>'}</div>, <div>{'[]'}</div>]
    // // -- COLOR CHANGE ON SCROLL -- //
    // useEffect(() => {
    //     if (props.changeColorOnScroll)
    //         window.addEventListener("scroll", headerColorChange);

    //     return function cleanup() {
    //         if (props.changeColorOnScroll)
    //             window.removeEventListener("scroll", headerColorChange);
    //     };
    // });

    // const headerColorChange = () => {
    //     if (!changeColorOnScroll) return;

    //     const windowsScrollTop = window.pageYOffset;
    //     if (windowsScrollTop > changeColorOnScroll.height) {
    //       document.body
    //         .getElementsByTagName("header")[0]
    //         .classList.remove(classes[color]);
    //       document.body
    //         .getElementsByTagName("header")[0]
    //         .classList.add(classes[changeColorOnScroll.color]);
    //     } else {
    //       document.body
    //         .getElementsByTagName("header")[0]
    //         .classList.add(classes[color]);
    //       document.body
    //         .getElementsByTagName("header")[0]
    //         .classList.remove(classes[changeColorOnScroll.color]);
    //     }
    //   };

      const handleDrawerToggle = () => {
        setMobileOpen((open) => !open);
      };

      const appBarClasses = classNames({
        [classes.appBar]: true,
        // [classes[color]]: color,
        // [classes.absolute]: absolute,
        [classes.flex]: true,
        [classes.fixed]: true
      });

      const brandComponent =
        <Button id="app-bar" className={classes.title}>{brand}</Button>;

    return <AppBar className={appBarClasses}>

        <Toolbar className={classes.container}>
            {/* {leftLinks ? brandComponent : null} */}
            {/* { brandComponent } */}
            {/* <div className="classes.flex">
                {leftLinks}
            </div> */}
            <div className={classes.flex}>
                {brandComponent}
                {leftLinks}
                {/* {leftLinks ? (
                    <Hidden smDown implementation="css">
                        {leftLinks}
                    </Hidden>
                ) : (brandComponent)} */}
            </div>
            {/* <Hidden smDown implementation="css">
                {rightLinks}
            </Hidden> */}

            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
            > <icons.Menu /> </IconButton>

        </Toolbar>
        {/* <Hidden mdUp implementation="js"> */}
            <Drawer
                variant="temporary"
                anchor={"right"}
                open={mobileOpen}
                classes={{
                    paper: classes.drawerPaper
                }}
                onClose={handleDrawerToggle}
            >
                <div className={classes.appResponsive}>
                {/* {leftLinks} */}
                {rightLinks}
                </div>
            </Drawer>
        {/* </Hidden> */}
  </AppBar>
}

const link = (_s: State) => ({  });
export default linker(link, Navbar);
