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

    WORKER_COHERENCE: () => a({
        type:'WORKER_COHERENCE'
    }),

    EEG_CONNECT: () => a({ type: "EEG_CONNECT" } as const),

    EEG_DISCONNECT: () => a({ type: "EEG_DISCONNECT" } as const),
}

export type Actions = ReturnType<
    typeof Actions[keyof typeof Actions]
>;
