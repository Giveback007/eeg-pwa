import { wait } from '@giveback007/util-lib';
import { eegConnectNavBtn, eegDisconnectNavBtn } from './nav-bar-links';
import { store } from './store';
import { eeg32, eegAtlas } from './eeg32';
import { WorkerUtil } from './workerUtil';
import { Actions } from './actions/index.actions';

export type Channel = {
    ch: number;
    tag: string | null;
    name: string;
}

var defaultTags = [
    {ch: 4, tag: "T3", viewing: true},
    {ch: 24, tag: "T4", viewing: true}
];

export const atlas = new eegAtlas(defaultTags);
export const eegConnection = new eeg32(undefined,() => {
    runEEGWorker();
}); //onDecoded callback to set state on front end.

const receivedMsg = (msg: { foo: string, output: any[] }) => {
    if (msg.foo === "coherence") {

      var posFFTList = [...msg.output[1]]; //Positive FFT array of arrays
      var coherenceResults = [...msg.output[2]];

      store.setState({
        posFFTList:posFFTList,
        coherenceResults:coherenceResults
      });

      var s = store.getState();

      eegConnection.channelTags.forEach((row: any, i: any) => {
        if(row.tag !== null && i < eegConnection.nChannels){
            //console.log(tag);
            atlas.mapFFTData(posFFTList, s.lastPostTime, i, row.tag);
          }
      });

      atlas.mapCoherenceData(coherenceResults, s.lastPostTime);


      Actions.COHERENCE_WORKER_DONE(); // Called AFTER processing everything into the state managers
    }
}

export const workers = new WorkerUtil(2,'./js/eegworker.js',(msg: any) => {receivedMsg(msg)}); //not sure I am passing this correctly

let bandPassWindow = atlas.bandPassWindow(0,100,eegConnection.sps)


atlas.fftMap = atlas.makeAtlas10_20();
atlas.coherenceMap = atlas.genCoherenceMap(atlas.channelTags);
atlas.fftMap.shared.bandPassWindow = bandPassWindow;
atlas.fftMap.shared.bandFreqs = atlas.getBandFreqs(bandPassWindow);
atlas.coherenceMap.shared.bandPassWindow = bandPassWindow;
atlas.coherenceMap.shared.bandFreqs = atlas.fftMap.shared.bandFreqs;


store.actionSub('COHERENCE_WORKER_DONE', (a) => {
  const s = store.getState();

  if(s.fdBackMode === 'coherence') {
      store.setState({lastPostTime:eegConnection.data.ms[eegConnection.data.ms.length-1]})
      workers.postToWorker({foo:'coherence', input:[bufferEEGData(), s.nSec, s.freqStart, s.freqEnd, eegConnection.scalar]});
  }

});

store.actionSub('CHANNEL_VIEW_SET', (a) => {
    var val =  a.data; //s.channelView

    if(val.length === 0) { return; }

    var arr = val.split(",");
    atlas.channelTags.forEach((row,j) => { atlas.channelTags[j].viewing = false; });
    var newSeries = [{}];

    arr.forEach((item,i) => {
        var found = false;
        let getTags = atlas.channelTags.find((o, j) => {

        if((o.ch === parseInt(item)) || (o.tag === item)){
        //console.log(item);
        atlas.channelTags[j].viewing = true;
        found = true;
        return true;
        }
        });


        if (found === false){ //add tag
        if(parseInt(item) !== NaN){
            atlas.channelTags.push({ch:parseInt(item), tag: null, viewing:true});
        }
        else {
            alert("Tag not assigned to channel: ", item);
        }
        }
    });

    //setuPlot();
});

store.actionSub('CHANNEL_TAGS_SET', (a) => {
    var val = a.data; //s.channelTags

    if(val.length === 0) { return; }
    //console.log(val);
    var arr = val.split(";");
    //console.log(arr);
    //channelTags.forEach((row,j) => { channelTags[j].viewing = false; });
    //console.log(arr);
    arr.forEach((item,i) => {
      var dict = item.split(":");
      var found = false;
      let setTags = atlas.channelTags.find((o, j) => {
        if(o.ch === parseInt(dict[0])){
          if(dict[1] === "delete"){
            atlas.channelTags.splice(j,1);
          }
          else{
            let otherTags = atlas.channelTags.find((p,k) => {
              if(p.tag === dict[1]){
                atlas.channelTags[k].tag = null;
                return true;
              }
            });

            //console.log(o);
            atlas.channelTags[j].tag = dict[1];
            atlas.channelTags[j].viewing = true;

            if(dict[2] !== undefined){
              var atlasfound = false;
              var searchatlas = atlas.fftMap.map.find((p,k) => {
                if(p.tag === dict[1]){
                  atlasfound = true;
                  return true;
                }
              });
              if(atlasfound !== true) {
                var coords = dict[2].split(",");
                if(coords.length === 3){
                    atlas.addToAtlas(dict[1],parseFloat(coords[0]),parseFloat(coords[1]),parseFloat(coords[2]))
                }
              }
            }
          }
          found = true;
          return true;
          }
        else if(o.tag === dict[1]){
            atlas.channelTags[j].tag = null; //Set tag to null since it's being assigned to another channel
        }
      });
      if (found === false){
        var ch = parseInt(dict[0]);
        if(ch !== NaN) {
          if((ch >= 0) && (ch < EEG.nChannels)){
            atlas.channelTags.push({ch:parseInt(ch), tag: dict[1], viewing: true});

            if(dict[2] !== undefined){
              var atlasfound = false;
              var searchatlas = atlas.fftMap.map.find((p,k) => {
                if(p.tag === dict[1]){
                  atlasfound = true;
                  return true;
                }
              });
              if(atlasfound !== true) {
                var coords = dict[2].split(",");
                if(coords.length === 3){
                  atlas.addToAtlas(dict[1],parseFloat(coords[0]),parseFloat(coords[1]),parseFloat(coords[2]))
                }
              }
            }
          }
        }
      }
    });

    atlas.coherenceMap = atlas.genCoherenceMap(atlas.channelTags); //Reset coherence map with new tags
    atlas.coherenceMap.shared.bandPassWindow = atlas.fftMap.shared.bandPassWindow;
    atlas.coherenceMap.shared.bandFreqs = atlas.atlas.shared.bandFreqs;

    //setBrainMap();
    //setuPlot();
});

//Sub action for setting the bandpass filter to update the bandpass
store.actionSub('BANDPASS_SET', (a) => {
  updateBandPass(a.data.freqStart,a.data.freqEnd);
});

store.actionSub(['EEG_CONNECT', 'EEG_DISCONNECT'], async (a) => {
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
    }
});

function runEEGWorker() {
    var s = store.getState();
    store.setState({["lastPostTime"]: eegConnection.data.ms[eegConnection.data.ms.length-1]});
    if(s.fdBackMode === 'coherence') {
        workers.postToWorker({foo:'coherence', input:[bufferEEGData(), s.nSec, s.freqStart, s.freqEnd, eegConnection.scalar]});
    }
}

function bufferEEGData() {
    var buffer = [];
    for(var i = 0; i < atlas.channelTags.length; i++){
        if(i < eegConnection.nChannels) {
            var channel = "A"+atlas.channelTags[i].ch;
            var dat = eegConnection.data[channel].slice(eegConnection.data.counter - eegConnection.sps, eegConnection.data.counter);
            buffer.push(dat);
        }
    }
    return buffer;

}

function updateBandPass(freqStart, freqEnd) {
    var freq0 = freqStart; var freq1 = freqEnd;
    if (freq0 > freq1) {
        freq0 = 0;
    }
    if(freq1 > eegConnection.sps*0.5){
        freq1 = eegConnection.sps*0.5;
        store.setState({freqEnd:freq1});
    }

    atlas.fftMap = atlas.makeAtlas10_20(); //reset atlas

    let bandPassWindow = atlas.bandPassWindow(freq0,freq1,eegConnection.sps);

    atlas.fftMap.shared.bandPassWindow = bandPassWindow;//Push the x-axis values for each frame captured as they may change - should make this lighter
    atlas.fftMap.shared.bandFreqs = atlas.getBandFreqs(bandPassWindow); //Update bands accessed by the atlas for averaging

    if(store.getState().fdBackMode === "coherence") {
        atlas.coherenceMap = atlas.genCoherenceMap(atlas.channelTags);
        atlas.coherenceMap.bandPasswindow = bandPassWindow;
        atlas.coherenceMap.shared.bandFreqs = atlas.fftMap.shared.bandFreqs;
    }
}
