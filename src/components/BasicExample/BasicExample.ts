import { Dict, equal, rand } from "@giveback007/util-lib";
import { html, render } from "lit-html";
import { SmoothieChart, TimeSeries } from "smoothie";
import { State, store } from "src/data/store";
import { Applet } from "../Applet/Applet"

// -- GEN DATA FOR EXAMPLE -- //
store.stateSub('lastVal', ({ lastVal, basicExampleChannels: ch }) => {
    const x = { ...(lastVal || { }) };
    ch.forEach(c => {
        if (!x[c]) x[c] = rand(1, 10000);
        let n = x[c] + rand(-20, 20);
        x[c] = n > 0 ? n : 0;
    });

    x.time = Date.now();
    setTimeout(() => store.setEegData(x), 200);
});
// -- GEN DATA FOR EXAMPLE -- //

type S = {
    mode: string,
    channel: string,
}

type M = {
    channels: State['basicExampleChannels'],
    // lastVal: any
}

export class BasicPlotExample extends Applet<S, M> {
    container: HTMLDivElement | null = null;
    canvasElm = document.createElement('canvas');
    series: Dict<TimeSeries> = { };
    chart = new SmoothieChart({
        interpolation: 'linear',
        scaleSmoothing: 0.7
    });

    randomClicks = 0;

    constructor(props: any) {
        super(props, (s) => ({ channels: s.basicExampleChannels }));
    }

    initialize(container: HTMLDivElement, state: S & M) {
        this.container = container;
        this.container.appendChild(this.canvasElm);

        store.stateSub('basicExampleChannels', (s) => {
            const ch = s.basicExampleChannels;

            ch.forEach(ch => {
                if (this.series[ch]) return;
                this.series[ch] = new TimeSeries();
            });

            this.renderSettings([{
                type: 'options',
                name: 'Mode',
                key: 'mode',
                selections: ['Mode-1', 'Mode-2', 'Mode-3'],
                default: 'Mode-2',
            }, {
                type: 'options',
                name: 'Channels',
                key: 'channel',
                selections: ch.map(c => c),
            }, {
                type: 'button',
                name: 'Random Button',
                action: 'RANDOM_CLICK',
            }]);
        }, true);

        store.stateSub('lastVal', (s) => {
            if (!s.lastVal) return;

            s.basicExampleChannels.forEach((ch) => {
                this.series[ch].append((s.lastVal as any).time, (s.lastVal as any)[ch]);
            });
        });

        this.chart.streamTo(this.canvasElm, 500);
    }

    onViewData(viewData: S & M, prev: S & M) {
        log('BasicPlotExample UPDATE!', viewData);

        if (viewData.channel !== prev.channel) {
            if (prev.channel) this.chart.removeTimeSeries(this.series[prev.channel]);

            const ser = this.series[viewData.channel];
            this.chart.addTimeSeries(ser, {
                strokeStyle: 'rgba(12, 154, 176, 1)',
                lineWidth: 2
            });
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
    }

    onAction(a: any) {
        switch (a.type) {
            case 'DESTROY_APPLET':
                return this.chart.stop();
            case 'RANDOM_CLICK':
                this.randomClicks++;
                return this.updateView();
        }
    }
}
