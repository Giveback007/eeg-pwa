import {
    getUrlParams, StateManager, stateManagerReactLinker, UrlObj,
    urlObjToString
} from "@giveback007/browser-utils";
import { isType, wait } from '@giveback007/util-lib';
import { createBrowserHistory } from "history";
import type { NavButton } from "src/components/Navbar/Navbar";
import { eegConnectNavBtn, eegDisconnectNavBtn, navLeftLinks, navRightLinks } from "./nav-bar-links";


export type State = {
    url: ReturnType<typeof getUrlParams>;
    navLeftLinks: NavButton[];
    navRightLinks: NavButton[];
    // text: string;
}

const initState: State = {
    url: getUrlParams(),
    navLeftLinks,
    navRightLinks,
}

class AppStateManager extends StateManager<State> {
    constructor() {
        super(initState);
        browserHist.listen(() =>
            store.setState({ url: getUrlParams() }));

        if (env === 'development')
            this.actionSub(true, (a) => log(a));
    }

    setPath(url: UrlObj | string) {
        const currentPath = browserHist.location.pathname;
        if (isType(url, 'string')) {
            return currentPath === url ?
                null : browserHist.push(url);
        }

        const obj = { ...url };
        delete obj.origin;

        const str = urlObjToString(obj);
        if (str === currentPath) return;

        browserHist.push(str);
    }

    changeNavBtn(nav: 'left' | 'right', idx: number, btn: NavButton) {
        const key = nav === 'left' ? 'navLeftLinks' : 'navRightLinks';
        const arr = [ ...this.getState()[key] ];
        arr[idx] = btn;
        this.setState({ [key]: arr });
    }
}

export const browserHist = createBrowserHistory();
export const store = new AppStateManager();
export const linker = stateManagerReactLinker(store);

store.actionSub(true, a => {
    switch (a.type) {
        case "EEG_CONNECT": {
            store.changeNavBtn('left', 0, { ...eegDisconnectNavBtn, loading: true });
            wait(800).then(() => store.changeNavBtn('left', 0, eegDisconnectNavBtn));
            break;
        }
        case "EEG_DISCONNECT": {
            store.changeNavBtn('left', 0, { ...eegConnectNavBtn, loading: true });
            wait(800).then(() => store.changeNavBtn('left', 0, eegConnectNavBtn));
            break;
        }
    }
})
