import { store } from "../store";
const a = <T>(x: T): T => store.action(x as any);

export const Acts = {
    ChannelViewSet: (data: string) => a({
        type: 'CHANNEL_VIEW_SET', data,
    } as const),

    ChannelTagsSet: (data: string) => a({
        type: 'CHANNEL_TAGS_SET', data,
    } as const),

    BandpassSet: (data: { lower: number, upper: number }) => a({
        type: 'BANDPASS_SET', data
    } as const),

    WorkerCoherence: (data: {
        posFFTList: number[], coherenceResults: number[]
    }) => a({ type: 'WORKER_COHERENCE', data } as const),

    EegConnect: () => a({ type: "EEG_CONNECT" } as const),

    EegDisconnect: () => a({ type: "EEG_DISCONNECT" } as const),
}

export type Actions = ReturnType<
    typeof Acts[keyof typeof Acts]
>;
