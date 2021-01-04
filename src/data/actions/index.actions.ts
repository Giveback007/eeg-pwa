import { store } from "../store";
const a = <T>(x: T): T => store.action(x as any);

export const Actions = {
    CHANNEL_VIEW_SET: (data: string) => a({
        type: 'CHANNEL_VIEW_SET', data
    } as const),

    CHANNEL_TAGS_SET: (data: string) => a({
        type: 'CHANNEL_TAGS_SET', data
    } as const),

    BANDPASS_SET: (data: { freqStart: number, freqEnd: number }) => a({
        type: 'BANDPASS_SET', data
    } as const),

    COHERENCE_WORKER_DONE: () => a({type:'COHERENCE_WORKER_DONE'} as const),

    EEG_CONNECT: () => a({ type: "EEG_CONNECT" } as const),

    EEG_DISCONNECT: () => a({ type: "EEG_DISCONNECT" } as const),

    TOP_OPTS_TOGGLE: () => a({ type: 'TOP_OPTS_TOGGLE' } as const),
}

export type ActionTypes = ReturnType<
    typeof Actions[keyof typeof Actions]
>;
