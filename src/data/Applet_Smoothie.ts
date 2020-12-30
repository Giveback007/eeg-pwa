import { eegConnection, atlas } from './eeg-initializer.ts'
import {SmoothieChartMaker, uPlotMaker, TimeChartMaker, Spectrogram, mirrorBarChart, eegBarChart, brainMap2D, BufferLoader, SoundJS, geolocateJS} from './eegvisuals'
import {gpuUtils} from './gpuUtils'
import { html, render as htmlrender } from 'lit-html';
import { store } from './store';
import { Applet } from 'src/components/Applet/Applet';

function genAppletHTML(containerId, visualId, width, height) {
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


export class SmoothieApplet extends Applet<S,M> {

    mode = "Smoothie";

    class: null | object = null;
    width: number | string;
    height: number | string;
    parentNode: HTMLElement;
    node: HTMLElement;
    storeSub: any;

    constructor(props, state) {
        super(props, (s) => {});

        this.parentNode = props.parentNode;
        this.width = props.width;
        this.height = props.height;

        store.actionSub("WORKER_DONE", (s, prev) => {
          this.onUpdate();
        });

        let id = "applet" + Math.floor(Math.random()*100000);

        htmlrender(genAppletHTML(id,id+"canvas",this.width,this.height),this.parentNode);
        this.node = document.getElementById(id);

        this.init();

    }

    onAction(a) {
        a.type
        'CHANGE_SOMETHING'
    }

    onRender(props: P, state: S, prevProps: P, prevState: S) {
        // update component here
    }

    onUpdate() {
        var graphmode = document.getElementById(this.class.canvasId+"mode").value;
        if((graphmode === "alpha") || (graphmode === "bandpowers")) {
            if(graphmode === "alpha"){
              atlas.channelTags.forEach((row,i) => {
                  var coord = {};
                  coord = atlas.getAtlasCoordByTag(row.tag);

                  if(i < this.class.series.length - 1){
                      this.class.series[i].append(Date.now(), Math.max(...coord.data.slices.alpha1[coord.data.slices.alpha1.length-1]));
                  }
              });
            }
            else if(graphmode === "bandpowers") {
              var ch = document.getElementById(this.class.canvasId+"channel").value;
              var tag = null;
              atlas.channelTags.find((o,i) => {
                  if(o.ch === ch){
                  tag = o.tag;
                  return true;
                  }
              });
              if(tag !== null){
                  var coord = atlas.getAtlasCoordByTag(tag);
                  this.class.bulkAppend([
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
            atlas.coherenceMap.map.forEach((row,i) => {
                if(i < this.class.series.length - 1){
                    this.class.series[i].append(Date.now(), Math.max(...row.data.slices.alpha1[row.data.slices.alpha1.length-1]));
                }
            });
        }

    }

    init() {

        addChannelOptions(this.node.id+"canvas"+"channel")

        this.class = new SmoothieChartMaker(8,this.node.id+"canvas");

        this.class.init('rgba(0,100,100,0.5)');
    }

    deInit() {
        this.class.deInit();
        this.class = null;
    }

}



function addChannelOptions(selectId) {
    var select = document.getElementById(selectId);
    select.innerHTML = "";
    var opts = ``;
    atlas.channelTags.forEach((row,i) => {
      if(i === 0) {
        opts += `<option value='`+row.ch+`' selected='selected'>`+row.ch+`</option>`
      }
      else {
        opts += `<option value='`+row.ch+`'>`+row.ch+`</option>`
      }
    });
    select.innerHTML = opts;
  }

  function addCoherenceOptions(selectId) {
    var select = document.getElementById(selectId);
    select.innerHTML = "";
    var newhtml = ``;
    atlas.coherenceMap.map.forEach((row,i) => {
      if(i===0) {
        newhtml += `<option value='`+row.tag+`' selected="selected">`+row.tag+`</option>`;
      }
      else{
        newhtml += `<option value='`+row.tag+`'>`+row.tag+`</option>`;
      }
    });
    select.innerHTML = newhtml;
  }
