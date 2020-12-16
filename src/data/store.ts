import {
    getUrlParams, StateManager, stateManagerReactLinker, UrlObj,
    urlObjToString
} from "@giveback007/browser-utils";
import { interval, isType, rand, wait } from '@giveback007/util-lib';
import { createBrowserHistory } from "history";
import type { NavButton } from "src/components/Navbar/Navbar";
import { eegConnectNavBtn, eegDisconnectNavBtn, navLeftLinks, navRightLinks } from "./nav-bar-links";
import { eeg32, eegatlas, eegmath } from './eeg32'

const channels: Channel[] = [
    { ch: 4, tag: "T3", viewing: true },
    { ch: 24, tag: "T4", viewing: true }
];

export const ATLAS = new eegatlas(channels);
export const eegConnection = new eeg32((data: any) => store.setEEGData(data));

export type Channel = {
    ch: number;
    tag: string;
    viewing: boolean;
}

export type State = {
    url: ReturnType<typeof getUrlParams>;
    navLeftLinks: NavButton[];
    navRightLinks: NavButton[];

    data: any; // FIXME
    lastVal: any // FIXME

    channels: Channel[],

    nSec: number,
    freqStart: number,
    freqEnd: number,
    lastPostTime: number,
    posFFTList: number[],
    coherenceResults: number[],
    bandPassWindow: number[],
    nSecAdcGraph: number,
    fdbackmode: "coherence" | "scp",
    newMsg: boolean,
    vscale: number,
    stepsPeruV: number,
    scalar: number,
    analyze: boolean,
    rawfeed: boolean,
}

const initState: State = {
    url: getUrlParams(),
    navLeftLinks,
    navRightLinks,

    data: [],
    lastVal: {},
    channels: channels,

    nSec: 1,
    freqStart: 0,
    freqEnd: 100,
    lastPostTime: 0,
    posFFTList: [],
    coherenceResults: [],
    bandPassWindow: [],
    nSecAdcGraph: 10,
    fdbackmode: "coherence",
    newMsg: true,
    vscale: eegConnection.vref*eegConnection.stepSize,
    stepsPeruV: 0.000001 / (eegConnection.vref*eegConnection.stepSize),
    scalar: 1/(0.000001 / (eegConnection.vref*eegConnection.stepSize)),
    // anim: null,
    analyze: false,
    // analyzeloop: null,
    rawfeed: false,
    // rawfeedloop: null,

}

class AppStateManager extends StateManager<State> {
    // data
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

    setEEGData(data: any) {
        this.setState({ lastVal: data })
    }
}

export const browserHist = createBrowserHistory();
export const store = new AppStateManager();
export const linker = stateManagerReactLinker(store);

const r = () => rand(1, 9);
interval(() => {
    store.setEEGData({
        T3: r(),
        T4: r(),
        time: Date.now(),
    });
}, 200);

// store.stateSub(s => log(s));

store.actionSub(true, a => {
    switch (a.type) {
        case "EEG_CONNECT": {
            eegConnection.setupSerialAsync();
            store.changeNavBtn('left', 0, { ...eegDisconnectNavBtn, loading: true });
            wait(800).then(() => store.changeNavBtn('left', 0, eegDisconnectNavBtn));
            break;
        }
        case "EEG_DISCONNECT": {
            eegConnection.closePort();
            store.changeNavBtn('left', 0, { ...eegConnectNavBtn, loading: true });
            wait(800).then(() => store.changeNavBtn('left', 0, eegConnectNavBtn));
            break;
        }
    }
});
