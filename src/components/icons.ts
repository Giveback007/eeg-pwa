import Apps from '@material-ui/icons/Apps';
import Dashboard from "@material-ui/icons/Dashboard";
import Menu from '@material-ui/icons/Menu';
import ListAlt from '@material-ui/icons/ListAlt';
import Settings from '@material-ui/icons/Settings';
import PlayArrow from '@material-ui/icons/PlayArrow';
import StopSharp from '@material-ui/icons/StopSharp';
import PowerSettings from '@material-ui/icons/PowerSettingsNew';
import Wifi from '@material-ui/icons/Wifi';
import WifiOff from '@material-ui/icons/WifiOff';
import AddCircle from '@material-ui/icons/AddCircle';
// import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
// import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import Tune from '@material-ui/icons/Tune';

// FIND-ICONS: https://material-ui.com/components/material-icons/
export const icons = {
    Apps, Menu, Dashboard, ListAlt, Settings, PlayArrow,
    StopSharp, PowerSettings, Wifi, WifiOff, AddCircle,
    Tune
    // ArrowDropDown, ArrowDropUp,
}

export type Icon = keyof typeof icons;
