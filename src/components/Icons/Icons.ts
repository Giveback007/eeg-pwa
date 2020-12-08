import Apps from '@material-ui/icons/Apps';
import Dashboard from "@material-ui/icons/Dashboard";
import Menu from '@material-ui/icons/Menu';
import ListAlt from '@material-ui/icons/ListAlt';
import Settings from '@material-ui/icons/Settings';

// FIND-ICONS: https://material-ui.com/components/material-icons/
export const icons = {
    Apps, Menu, Dashboard, ListAlt, Settings
}

export type Icon = keyof typeof icons;
