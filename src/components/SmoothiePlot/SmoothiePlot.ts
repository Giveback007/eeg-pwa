import { Applet } from "../Applet/Applet";

import type { Dict } from "@giveback007/util-lib";
import { html, render } from "lit-html";
import { SmoothieChart, TimeSeries } from "smoothie";
import { Channel, store } from "src/data/store";


type S = {
    mode: string,
    channel: string,
}

type M = {
    channelTags: Channel[],
    // lastVal: any
}

export class SmoothPlotComponent extends Applet<S, M> {
    constructor(props: any) {
        super(props, (s) => ({ channelTags: s.basicExampleChannels }))
    }
}
