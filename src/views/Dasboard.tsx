import React from 'react';
import { linker, State } from '../data/store';
import Navbar, { NavButton } from 'src/components/Navbar/Navbar';
// type S = { };
// type P = { } & ReturnType<typeof link>;

const leftLinks: NavButton[] = [{
    icon: 'PowerSettings',
    active: false,
    // loading: true,
    // title: 'Connect'
    // disabled: true,
}, {
    icon: 'PlayArrow',
    active: true,
    disabled: false,
    // title: 'Play'
}, {
    icon: 'StopSharp',
    active: false,
    disabled: false,
    // title: 'Stop'
}]

const rightLinks: NavButton[] = [{
    title: 'Save CSV',
    loading: true
}, {
    title: 'Set BandPass',
    icon: 'PlayArrow',
}, {
    title: 'Set Channel View'
}, {
    title: 'Set Tags'
}]

function Dasboard() {
    return <>
        <Navbar
            brand="Web-BCI"
            rightMenuBtns={leftLinks}
            topMenuBtns={rightLinks}
        />
    </>
}

const link = (_s: State) => ({  });
export default linker(link, Dasboard);
