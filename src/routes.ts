import { icons } from "components/Icons/Icons";
import Sessions from "views/Sessions";
import Settings from "views/Settings";
import Dashboard from 'views/Dasboard';

export type RouteObj = {
    path: string;
    name: string;
    icon: React.ComponentType;
    component: React.ComponentType;
}

const routes: RouteObj[] = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: icons.Dashboard,
      component: Dashboard,
    //   layout: "/admin"
    }, {
        path: "/sessions",
        name: "Sessions",
        icon: icons.ListAlt,
        component: Sessions,
        // layout: "/admin"
    }, {
      path: "/settings",
      name: "Settings",
      icon: icons.Settings,
      component: Settings,
    //   layout: "/admin"
    },
];

export default routes;
