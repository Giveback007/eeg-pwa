import {
    getUrlParams, StateManager, stateManagerReactLinker, UrlObj,
    urlObjToString
} from "@giveback007/browser-utils";
import { Dict, isType, wait } from '@giveback007/util-lib';
import { createBrowserHistory } from "history";
import type { NavButton } from "src/components/Navbar/Navbar";
import { eegConnection } from "./eeg-initializer";
import { eegConnectNavBtn, eegDisconnectNavBtn, navLeftLinks, navRightLinks } from "./nav-bar-links";

type ChannelAction = {
    type: 'TAG_SET',
    data: string,
}

export type State = {
    url: ReturnType<typeof getUrlParams>;
    navLeftLinks: NavButton[];
    navRightLinks: NavButton[];

    data: any; // FIXME
    lastVal: Dict<number> | null; // FIXME
    basicExampleChannels: string[]; // not correct, simply being used for basic example.

    nSec: number,
    freqStart: number,
    freqEnd: number,
    lastPostTime: number,
    posFFTList: number[],
    coherenceResults: number[],
    bandPassWindow: number[],
    nSecAdcGraph: number,
    fdBackMode: "coherence" | "scp",
    newMsg: boolean,
    vScale: number,
    stepsPeruV: number,
    scalar: number,
    analyze: boolean,
    rawFeed: boolean,
}

const initState: State = {
    url: getUrlParams(),
    navLeftLinks,
    navRightLinks,

    data: [],
    lastVal: {},
    basicExampleChannels: ['T2', 'T4'],

    nSec: 1,
    freqStart: 0,
    freqEnd: 100,
    lastPostTime: 0,
    posFFTList: [],
    coherenceResults: [],
    bandPassWindow: [],
    nSecAdcGraph: 10,
    fdBackMode: "coherence",
    newMsg: true,
    vScale: eegConnection.vref * eegConnection.stepSize,
    stepsPeruV: 0.000001 / (eegConnection.vref * eegConnection.stepSize),
    scalar: 1 / (0.000001 / (eegConnection.vref * eegConnection.stepSize)),
    analyze: false,
    rawFeed: false,

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

    setEegData(data: any) { // FIXME
      this.throttledSetState(50, {
        lastVal: data
      })
    }
}

export const browserHist = createBrowserHistory();
export const store = new AppStateManager();
export const linker = stateManagerReactLinker(store);

store.actionSub(true, async (a) => {
    switch (a.type) {
        case "EEG_CONNECT": {
            store.changeNavBtn('left', 0, { ...eegDisconnectNavBtn, loading: true });
            await eegConnection.setupSerialAsync();
            await wait(500); // creates a sense of a more responsive ui
            store.changeNavBtn('left', 0, eegDisconnectNavBtn);
            break;
        }
        case "EEG_DISCONNECT": {
            store.changeNavBtn('left', 0, { ...eegConnectNavBtn, loading: true });
            await eegConnection.closePort();
            await wait(500); // creates a sense of a more responsive ui
            store.changeNavBtn('left', 0, eegConnectNavBtn);
            break;
        }
        case "TAG_SET": {
            const { data } = a;
            // data = '1' | '2'
            break;
        }
    }
});



/*
let obj = new eegatlas([{tag:"Tag1", ch: 0},{tag:"Tag2", ch:1}]);
obj.atlas.map == [{"Tag1", data:{}},{"Tag2", data:{}}}]

if add to obj.channelTags:
automatically begin applying FFTs to that channel,
if tag is not found in the atlas, push a new atlas.map object with the new tag, then regen the obj.coherenceMap = obj.genCoherenceMap();
if tag null, it doesn't apply FFTs or push to the atlas

update menus with new tags available,
each applet can view different channels/data separately based on the channeltags settings and individual view options

e.g. uplot, smoothie, or timechart can view multiple channels simultaneously and pull data from eeg32.data, obj.atlas, or obj.coherenceMap


options needed:

setTags:
e.g: a "0:Fz" or b "0:delete" or c "0:Pnew:1,2,3"

setTimeWindow: e.g. 10sec or 30sec

store.actionSub('TAG_SET', a => X(a))

// document.getElementById("setTags").onclick = () => {
    function X(a) {
  var val = document.getElementById("channelTags").value;
  if(val.length === 0) { return; }
  //console.log(val);
  var arr = val.split(";");
  //console.log(arr);
  //channelTags.forEach((row,j) => { channelTags[j].viewing = false; });
  //console.log(arr);
  arr.forEach((item,i) => {
    var dict = item.split(":");
    var found = false;
    let setTags = EEG.channelTags.find((o, j) => {
      if(o.ch === parseInt(dict[0])){
        if(dict[1] === "delete"){
          EEG.channelTags.splice(j,1);
        }
        else{
          let otherTags = EEG.channelTags.find((p,k) => {
            if(p.tag === dict[1]){
              EEG.channelTags[k].tag = null;
              return true;
            }
          });

          //console.log(o);
          EEG.channelTags[j].tag = dict[1];
          EEG.channelTags[j].viewing = true;

          if(dict[2] !== undefined){
            var atlasfound = false;
            var searchatlas = EEG.atlas.map.find((p,k) => {
              if(p.tag === dict[1]){
                atlasfound = true;
                return true;
              }
            });
            if(atlasfound !== true) {
              var coords = dict[2].split(",");
              if(coords.length === 3){
                EEG.addToAtlas(dict[1],parseFloat(coords[0]),parseFloat(coords[1]),parseFloat(coords[2]))
              }
            }
          }
        }
        found = true;
        return true;
        }
      else if(o.tag === dict[1]){
        EEG.channelTags[j].tag = null; //Set tag to null since it's being assigned to another channel
      }
    });
    if (found === false){
      var ch = parseInt(dict[0]);
      if(ch !== NaN) {
        if((ch >= 0) && (ch < EEG.nChannels)){
          EEG.channelTags.push({ch:parseInt(ch), tag: dict[1], viewing: true});

          if(dict[2] !== undefined){
            var atlasfound = false;
            var searchatlas = EEG.atlas.map.find((p,k) => {
              if(p.tag === dict[1]){
                atlasfound = true;
                return true;
              }
            });
            if(atlasfound !== true) {
              var coords = dict[2].split(",");
              if(coords.length === 3){
                EEG.addToAtlas(dict[1],parseFloat(coords[0]),parseFloat(coords[1]),parseFloat(coords[2]))
              }
            }
          }
        }
      }
    }
  });

  EEG.coherenceMap = EEG.genCoherenceMap(EEG.channelTags); //Reset coherence map with new tags
  EEG.coherenceMap.shared.bandPassWindow = session.bandPassWindow;
  EEG.coherenceMap.shared.bandFreqs = EEG.atlas.shared.bandFreqs;

  setBrainMap();
  setuPlot();
}

*/
