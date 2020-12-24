import { Eeg32, EegAtlas } from './eeg32'
import { store } from './store';

export type Channel = {
    ch: number;
    tag: string | null;
    name: string;
}

export const atlas = new EegAtlas();
export const eegConnection = new Eeg32((data: any) => store.setEegData(data));
// FIXME (data: any)
