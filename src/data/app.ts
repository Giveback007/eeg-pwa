import { eeg32, eegatlas, eegmath } from './eeg32'
import {SmoothieChartMaker, uPlotMaker, TimeChartMaker, Spectrogram, mirrorBarChart, eegBarChart, brainMap2D, BufferLoader, SoundJS, geolocateJS} from './eegvisuals'
import {gpuUtils} from './gpuUtils'
import { html, render } from 'lit-html';
import { store, eegConnection as EEG, ATLAS } from './store';
import { Applet } from 'src/components/Applet/Applet';

function genSmoothieContainer(containerId, visualId, width, height) {
    return html`
    <div id='${containerId}' width='${width}' height='${height}'>
      Mode:
      <select id='${visualId+"mode"}'>
        <option value="alpha" selected="selected">Alpha1 Bandpowers</option>
        <option value="coherence">Alpha1 Coherence</option>
        <option value="bandpowers">1Ch All Bandpowers</option>
      </select>
      Channels:
      <select id='${visualId+"channel"}'>
        <option value="0">0</option>
      </select>
      <canvas id='${visualId}' width='${width}' height='${height}' style='width:${width+"px"}; height:${height+"px"};'></canvas>
    </div>
    `;
}

export class SmoothChart extends Applet {

    // container:
    // x = {
    id: containerId,
    parent: null,
    child: null,
    width: width,
    height: height,
    mode: "none",
    class: null
    // }
    constructor(props) {
        super(props, {});

        

    }

    container: HTMLDivElement | null = null;
    canvasElm = document.createElement('canvas');

    initialize(container: HTMLDivElement, props, state) {
        this.canvasElm.id = 'someid'
        this.container = container;
        // const canvasElm = document.createElement('canvas');

        this.class = new SmoothieChartMaker(8, this.canvasElm);
        // this.mode = "smoothie";
        // this.child = document.getElementById(containerId).parentNode;

        const x = genSmoothieContainer();

        var HTMLtoAppend = genSmoothieContainer(containerId, visualId, obj.width, obj.height);

        // appendFragment(HTMLtoAppend,obj.id);
        addChannelOptions(this.changeChannels);

        // obj.class = new SmoothieChartMaker(8,visualId);
        // obj.mode = "smoothie";
        // obj.child = document.getElementById(containerId).parentNode;

        obj.class.init('rgba(0,100,100,0.5)');

        props
        state
    }

    onRender(props: P, state: S, prevProps: P, prevState: S) {
        // update componenet here
    }

    onAction(a) {
        a.type
        'CHANGE_SOMETHING'


    }

    resetmode() {
          this.class.deInit();
          this.class = null;
          this.mode = "none";
    }

    changeChannels(ev: Event) {
        /// do the things
    }
}


window.session.bandPassWindow = gpu.bandPassWindow(window.session.freqStart,window.session.freqEnd,EEG.sps)

ATLAS.atlas.shared.bandPassWindow = window.session.bandPassWindow;
ATLAS.atlas.shared.bandFreqs = ATLAS.getBandFreqs(window.session.bandPassWindow);
ATLAS.coherenceMap.shared.bandPassWindow = window.session.bandPassWindow;
ATLAS.coherenceMap.shared.bandFreqs = ATLAS.atlas.shared.bandFreqs;




function setupVisualContainer(containerId, width, height, mode="none", appendToId){
    var containerobj = {
      id: containerId,
      elem: null,
      child: null,
      width: width,
      height: height,
      mode: "none",
      class: null,
      resetmode: function() {
        if(this.class !== null){
          this.class.deInit();
          this.elem.removeChild(this.child);
          this.class = null;
          this.mode = "none";
        }
      }
    };

    var HTMLtoAppend = genVisualContainer(containerId, width, height);
    appendFragment(HTMLtoAppend, appendToId);
    containerobj.id = containerId;
    containerobj.elem = document.getElementById(containerId);

    if(mode !== "none"){
      setMode(mode,containerobj);
    }

    return containerobj; //Make sure to store this
  }


//Container HTML and menus to be targeted by the appropriate class

function genVisualContainer(containerId, width, height){
    return html`
    <div id='${containerId}' width='${width+"px"}' height='${height+"px"}'></div>
    `; //Put menus in here for switching inner visuals?
  }

function genSmoothieContainer(containerId, visualId, width, height) {
    return html`
    <div id='${containerId}' width='${width}' height='${height}'>
      Mode:
      <select id='${visualId+"mode"}'>
        <option value="alpha" selected="selected">Alpha1 Bandpowers</option>
        <option value="coherence">Alpha1 Coherence</option>
        <option value="bandpowers">1Ch All Bandpowers</option>
      </select>
      Channels:
      <select id='${visualId+"channel"}'>
        <option value="0">0</option>
      </select>
      <canvas id='${visualId}' width='${width}' height='${height}' style='width:${width+"px"}; height:${height+"px"};'></canvas>
    </div>
    `;
  }


  function addChannelOptions(fct) {
    // var select = document.getElementById(selectId);
    select.innerHTML = "";
    var opts = ``;
    EEG.channelTags.forEach((row,i) => {
      if(i === 0) {
        opts += `<option value='`+row.ch+`' selected='selected'>`+row.ch+`</option>`
      }
      else {
        opts += `<option value='`+row.ch+`'>`+row.ch+`</option>`
      }
    });
    select.innerHTML = opts;
  }

//   function setupSmoothieContainer(containerId, visualId, obj) {
//     var HTMLtoAppend = genSmoothieContainer(containerId, visualId, obj.width, obj.height);

//     appendFragment(HTMLtoAppend,obj.id);
//     addChannelOptions(visualId+"channel");

//     obj.class = new SmoothieChartMaker(8,visualId);
//     obj.mode = "smoothie";
//     obj.child = document.getElementById(containerId).parentNode;

//     obj.class.init('rgba(0,100,100,0.5)');
//   }


  function updateSmoothieContainer = (obj) => {
    var graphmode = document.getElementById(obj.class.canvasId+"mode").value;
    if((graphmode === "alpha") || (graphmode === "bandpowers")) {
      if(graphmode === "alpha"){
        ATLAS.channelTags.forEach((row,i) => {
          var coord = {};
          coord = ATLAS.getAtlasCoordByTag(row.tag);

          if(i < obj.class.series.length - 1){
            obj.class.series[i].append(Date.now(), Math.max(...coord.data.slices.alpha1[coord.data.slices.alpha1.length-1]));
          }
        });
      }
      else if(graphmode === "bandpowers") {
        var ch = document.getElementById(obj.class.canvasId+"channel").value;
        var tag = null;
        ATLAS.channelTags.find((o,i) => {
          if(o.ch === ch){
            tag = o.tag;
            return true;
          }
        });
        if(tag !== null){
          var coord = ATLAS.getAtlasCoordByTag(tag);
          obj.class.bulkAppend([
            Math.max(...coord.data.slices.delta[coord.data.slices.delta.length-1]),
            Math.max(...coord.data.slices.theta[coord.data.slices.theta.length-1]),
            Math.max(...coord.data.slices.alpha1[coord.data.slices.alpha1.length-1]),
            Math.max(...coord.data.slices.alpha2[coord.data.slices.alpha2.length-1]),
            Math.max(...coord.data.slices.beta[coord.data.slices.beta.length-1]),
            Math.max(...coord.data.slices.lowgamma[coord.data.slices.lowgamma.length-1])
          ]);
        }
      }
    }
    else if (graphmode === "coherence") {
        ATLAS.coherenceMap.map.forEach((row,i) => {
        if(i < obj.class.series.length - 1){
          obj.class.series[i].append(Date.now(), Math.max(...row.data.slices.alpha1[row.data.slices.alpha1.length-1]));
        }
      });
    }
  }



  function setMode(mode,obj) {
    if(obj.mode !== "none") {
      obj.resetmode();
    }
    var containerId = obj.id + mode;
    var visualId = obj.id + "canvas";
    if (mode === "uplot"){
      //setupuPlotContainer(containerId, visualId, obj);
    } else if (mode === "smoothie") {
      setupSmoothieContainer(containerId, visualId, obj);
    } else if (mode === "brainmap") {
      //setupBrainMapContainer(containerId, visualId, obj);
    } else if (mode === "timecharts") {
      //setupTimeChartContainer(containerId, visualId, obj);
    } else if (mode === "spectrogram") {
      //setupSpectrogramContainer(containerId, visualId, obj);
    } else if (mode === "barchart") {
      //setupBarChartContainer(containerId, visualId, obj);
    } else if (mode === "mirror") {
      //setupMirrorChartsContainer(containerId, visualId, obj);
    } else if (mode === "none") {
      obj.resetmode();
    }
  }





  var vis3 = setupVisualContainer("visual3",700,200,"smoothie","block3");


  window.session.visuals = [vis3];
