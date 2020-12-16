import type { Dict } from "@giveback007/util-lib";
import { html, render } from "lit-html";
import { SmoothieChart, TimeSeries } from "smoothie";
import { Channel, store } from "src/data/store";
import { Applet } from "../Applet/Applet"

type S = {
    mode: string,
    channel: string,
}

type M = {
    channelTags: Channel[],
    // lastVal: any
}

export class BasicPlotExample extends Applet<S, M> {
    container: HTMLDivElement | null = null;
    canvasElm = document.createElement('canvas');
    series: Dict<TimeSeries> = {};
    chart = new SmoothieChart({
        interpolation: 'linear',
        scaleSmoothing: 0.7
    });

    randomClicks = 0;

    constructor(props: any) {
        super(props, (s) => ({ channelTags: s.channels }));
    }

    initialize(container: HTMLDivElement, state: S & M) {
        this.container = container;
        this.container.appendChild(this.canvasElm);

        state.channelTags
            .forEach(tag => this.series[tag.tag] = new TimeSeries())

        store.keysSub('lastVal', (s) => {
            s.channels.forEach((ch) => {
                const { tag } = ch;
                this.series[tag].append(s.lastVal.time, s.lastVal[tag]);
            });
        });

        // store.stateSub(s => s)
        store.actionSub(true, a => {
            log('another!', a)
        })

        this.chart.streamTo(this.canvasElm, 500);
        // debugger
        this.renderSettings([{
            type: 'options',
            name: 'Mode',
            key: 'mode',
            selections: ['Mode-1', 'Mode-2', 'Mode-3'],
            default: 'Mode-2'
        }, {
            type: 'options',
            name: 'Channels',
            key: 'channel',
            selections: state.channelTags.map(ch =>  ch.tag),
            default: 'T4',
        }, {
            type: 'button',
            name: 'Random Button',
            action: 'RANDOM_CLICK'
        }]);
    }

    onViewData(viewData: S & M, prev: S & M) {
        log('UPDATE!', viewData);

        if (viewData.channel !== prev.channel) {
            if (prev.channel) this.chart.removeTimeSeries(this.series[prev.channel]);

            const ser = this.series[viewData.channel];
            // window.ser = () => ser;
            this.chart.addTimeSeries(ser, {
                strokeStyle: 'rgba(12, 154, 176, 1)',
                lineWidth: 2
            });
            // debugger
            // this.chart.streamTo(this.canvasElm, 500);
        }

        this.updateView();
    }

    updateView() {
        if (!this.container) throw Error('Ya tried to render before ya had a container');

        render(html`
            <h3>My Example:</h3>
            ${this.canvasElm}
            <h3>Channel: ${this.viewData.channel}</h3>
            <h3>Mode: ${this.viewData.mode}</h3>
            <h3>Random Clicks: ${this.randomClicks}</h3>
        `, this.container);
    };

    onAction(a: any) {
        switch (a.type) {
            case 'DESTROY_APPLET':
                return this.deInit();
            case 'RANDOM_CLICK':
                this.randomClicks++;
                return this.updateView();
        }
    }

    deInit() {
        this.chart.stop();
    }
}
