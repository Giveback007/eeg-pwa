import { eeg32, eegAtlas } from './eeg32'
import { store } from './store';
import { eegWorkerUtil } from './eegWorkerUtil'

export type Channel = {
    ch: number;
    tag: string | null;
    name: string;
}

export const atlas = new eegAtlas();
export const eegConnection = new eeg32(() => {
    store.setEegData(eegConnection.data); // Throttled updating
}); //onDecoded callback to set state on front end.
export const workers = new eegWorkerUtil(2);

let bandPassWindow = atlas.bandPassWindow(0,100,eegConnection.sps)

atlas.channelTags = [
    {ch: 4, tag: "T3", viewing: true},
    {ch: 24, tag: "T4", viewing: true}
];
  
atlas.fftMap = atlas.makeAtlas10_20();
atlas.coherenceMap = atlas.genCoherenceMap(atlas.channelTags);
atlas.fftMap.shared.bandPassWindow = bandPassWindow;
atlas.fftMap.shared.bandFreqs = atlas.getBandFreqs(bandPassWindow);
atlas.coherenceMap.shared.bandPassWindow = bandPassWindow;
atlas.coherenceMap.shared.bandFreqs = atlas.fftMap.shared.bandFreqs;
  


store.stateSub((s) => {
    //if newMsg === true and new EEG data comes through:  fire off another message to the workers, use newMsg to make sure workers are not overwhelmed if running slower than setEegData
    //on posFFTList update: atlas.mapFFTData(s.posFFTList,s.lastPostTime)
    //on coherenceResults update: atlas.mapCoherenceData(s.coherenceResults)
    //on bandpass bounds change: updateBandPass(freqStart,freqEnd)
});


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

    if(store.getState("fdbackmode") === "coherence") {
        atlas.coherenceMap = atlas.genCoherenceMap(EEG.channelTags);
        atlas.coherenceMap.bandPasswindow = bandPassWindow;
        atlas.coherenceMap.shared.bandFreqs = atlas.fftMap.shared.bandFreqs;
    }
}