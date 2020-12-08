import { icons } from "./components/Icons/Icons";
import Dashboard from './views/Dasboard';

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
        component: ,
        // layout: "/admin"
    }, {
      path: "/settings",
      name: "Settings",
      icon: icons.Settings,
      component: ,
    //   layout: "/admin"
    },
];

export default routes;
