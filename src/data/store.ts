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
        if (isType(url, 'string')) return browserHist.push(url);

        const obj = { ...url };
        delete obj.origin;

        browserHist.push(urlObjToString(obj));
    }
}

export const browserHist = createBrowserHistory();
export const store = new AppStateManager();
export const linker = stateManagerReactLinker(store);
