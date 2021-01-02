import type { NavButton } from "src/components/Navbar/Navbar";

export const eegConnectNavBtn: NavButton = {
    icon: 'WifiOff',
    action: 'EEG_CONNECT'
}

export const eegDisconnectNavBtn: NavButton = {
    icon: 'Wifi',
    action: 'EEG_DISCONNECT',
    active: true,
}

export const navLeftLinks: NavButton[] = [
    eegConnectNavBtn,
{
    icon: 'PlayArrow',
    action: 'EEG_ANALYZE'
    // active: true,
    // disabled: false,
    // title: 'Play'
}, {
    icon: 'StopSharp',
    action: 'EEG_STOP'
    // active: false,
    // disabled: false,
    // title: 'Stop'
}];

export const navRightLinks: NavButton[] = [{
    title: 'Save CSV',
    action: 'CSV_SAVE',
    // loading: true
}, {
    title: 'Set BandPass',
    action: 'BANDPASS'
    // icon: 'PlayArrow',
}, {
    title: 'Set Channel View',
    action: 'CHANNEL_SET_VIEW',
}, {
    title: 'Set Tags',
    action: 'TAGS_SET'
}, {
    title: 'Settings',
    route: '/settings'
}];
