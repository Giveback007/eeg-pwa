import {
    getUrlParams, StateManager, stateManagerReactLinker, UrlObj,
    urlObjToString
} from "@giveback007/browser-utils";
import { Dict, isType } from '@giveback007/util-lib';
import { createBrowserHistory } from "history";
import type { NavButton } from "src/components/Navbar/Navbar";
import type { ActionTypes } from "./actions/index.actions";
import { navLeftLinks, navRightLinks } from "./nav-bar-links";

export type State = {
    url: ReturnType<typeof getUrlParams>;
    navLeftLinks: NavButton[];
    navRightLinks: NavButton[];

    data: any; // FIXME
    lastVal: Dict<number> | null; // FIXME
    basicExampleChannels: string[]; // not correct, simply being used for basic example.

    /** Number of seconds of FFT data to process */
    nSec: number,
    /**  Beginning of bandpass window */
    freqStart: number,
    /** End of bandpass window */
    freqEnd: number,
    /** Last time when data was posted to worker */
    lastPostTime: number,
    /** List of FFT results from worker */
    posFFTList: number[],
    /** List of coherence results from worker */
    coherenceResults: number[],
    nSecAdcGraph: number,
    fdBackMode: "coherence" | "scp",
    analyze: boolean,
    rawFeed: boolean,
}

const initState: State = {
    url: getUrlParams(),
    navLeftLinks,
    navRightLinks,

    data: [],
    lastVal: { },
    basicExampleChannels: ['T2', 'T4'],

    nSec: 1,
    freqStart: 0,
    freqEnd: 100,
    lastPostTime: 0,
    posFFTList: [],
    coherenceResults: [],
    nSecAdcGraph: 10,
    fdBackMode: "coherence",
    analyze: false,
    rawFeed: false
}


class AppStateManager extends StateManager<State, ActionTypes> {

    constructor() {
        super(initState);
        browserHist.listen(() =>
            store.setState({ url: getUrlParams() }));

        if (env === 'development')
            this.actionSub(true, (a) => log('store action:', a));
    }

    setPath(url: UrlObj | string) {
        const currentPath = browserHist.location.pathname;
        if (isType(url, 'string'))
            return currentPath === url ? null : browserHist.push(url);

        const obj = { ...url };
        delete obj.origin;

        const str = urlObjToString(obj);
        if (str === currentPath) return;

        browserHist.push(str);
    }

    changeNavBtn(
        nav: 'left' | 'right',
        idx: number,
        btn: NavButton
    ) {
        const key = nav === 'left' ? 'navLeftLinks' : 'navRightLinks';
        const arr = [ ...this.getState()[key] ];
        arr[idx] = btn;
        this.setState({ [key]: arr });
    }

    setEegData(data: any) { // FIXME
        this.throttledSetState(50, {
            lastVal: data
        })
    }
}

export const browserHist = createBrowserHistory();
export const store = new AppStateManager();
export const linker = stateManagerReactLinker(store);
