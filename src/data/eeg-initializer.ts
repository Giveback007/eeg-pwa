import { eeg32, eegAtlas } from './eeg32'
import { store } from './store';
import { WorkerUtil } from './workerUtil'

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

var receivedMsg = (msg: any) => {
    if(msg.foo === "coherence") {
        var fftData = [...msg.output[1]];
        var coherenceData = [...msg.output[2]];
        store.setState({
            ["posFFTList"]:fftData,
            ["coherenceResults"]:coherenceData
        });

        var lastPostTime = store.getState().lastPostTime;

        eegConnection.channelTags.forEach((row: any,i: any) => {
            if((row.tag !== null) && (i < eegConnection.nChannels)){
                //console.log(tag);
                atlas.mapFFTData(fftData, lastPostTime, i, row.tag);
            }
        });

        atlas.mapCoherenceData(coherenceData, lastPostTime);


        store.action('WORKER_DONE');
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


let workerThrottle = 50; //throttle speed in milliseconds

store.actionSub('WORKER_DONE', (a) => {
    var s = store.getState();
    if(performance.now() - s.lastPostTime > workerThrottle)
    {
        runEEGWorker();
    }
    else {
        setTimeout(()=>{
            runEEGWorker();
        },
        performance.now()-s.lastPostTime);//Throttle worker posting time
    }
});

store.actionSub('SET_TAGS', (a) => {

});

//Sub action for setting the bandpass filter to update the bandpass
store.actionSub('SET_BANDPASS', (a) => {

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
     freq1 = eegConnection.sps*0.5; document.getElementById("freqEnd").value = freq1;
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
