import { StateManager, stateManagerReactLinker } from "@giveback007/browser-utils";

export type State = {
    text: string;
}

export const store = new StateManager<State>({
    text: 'Some Text',
});

export const linker = stateManagerReactLinker(store);
