import {
    getUrlParams, StateManager, stateManagerReactLinker, UrlObj,
    urlObjToString
} from "@giveback007/browser-utils";
import { isType, wait } from '@giveback007/util-lib';
import { createBrowserHistory } from "history";
import type { NavButton } from "src/components/Navbar/Navbar";
import { eegConnectNavBtn, eegDisconnectNavBtn, navLeftLinks, navRightLinks } from "./nav-bar-links";
import { eeg32, eegatlas, eegmath } from './eeg32'

export let eegConnection = new eeg32((data) => store.setEEGData(data));
export const ATLAS = new eegatlas();
ATLAS.channelTags = [
  {ch: 4, tag: "T3", viewing: true},
  {ch: 24, tag: "T4", viewing: true}
];
ATLAS.coherenceMap = ATLAS.genCoherenceMap();

export type State = {
    url: ReturnType<typeof getUrlParams>;
    navLeftLinks: NavButton[];
    navRightLinks: NavButton[];
    data: any;

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
    data: {},


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
    analyzeloop: null,
    rawfeed: false,
    rawfeedloop: null,

}

class AppStateManager extends StateManager<State> {
    data
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
        this.data = data;
    }
}

export const browserHist = createBrowserHistory();
export const store = new AppStateManager();
export const linker = stateManagerReactLinker(store);


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
})
