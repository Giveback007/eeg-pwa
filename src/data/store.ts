import { StateManager, stateManagerReactLinker } from "@giveback007/browser-utils";

export type State = {
}

export const store = new StateManager<State>({

});

export const linker = stateManagerReactLinker(store);
