import Apps from '@material-ui/icons/Apps';
import Dashboard from "@material-ui/icons/Dashboard";
import Menu from '@material-ui/icons/Menu';
import ListAlt from '@material-ui/icons/ListAlt';
import Settings from '@material-ui/icons/Settings';
import PlayArrow from '@material-ui/icons/PlayArrow';
import StopSharp from '@material-ui/icons/StopSharp';
import PowerSettings from '@material-ui/icons/PowerSettingsNew';
import WifiIcon from '@material-ui/icons/Wifi';
import WifiOffIcon from '@material-ui/icons/WifiOff';

// FIND-ICONS: https://material-ui.com/components/material-icons/
export const icons = {
    Apps, Menu, Dashboard, ListAlt, Settings, PlayArrow,
    StopSharp, PowerSettings, WifiIcon, WifiOffIcon,
}

export type Icon = keyof typeof icons;
