import {
    getUrlParams, StateManager, stateManagerReactLinker, UrlObj,
    urlObjToString
} from "@giveback007/browser-utils";
import { isType } from '@giveback007/util-lib';
import { createBrowserHistory } from "history";


export type State = {
    url: ReturnType<typeof getUrlParams>;
    // text: string;
}

const initState: State = {
    url: getUrlParams(),
}

class AppStateManager extends StateManager<State> {
    constructor() {
        super(initState);
        browserHist.listen(() =>
            store.setState({ url: getUrlParams() }));
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
}

export const browserHist = createBrowserHistory();
export const store = new AppStateManager();
export const linker = stateManagerReactLinker(store);
