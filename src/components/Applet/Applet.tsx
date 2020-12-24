import { equal } from '@giveback007/util-lib';
import React from 'react';
import { State, store } from 'src/data/store';

export type AppletSetting<S, T extends string = string> = {
    type: 'options',
    key: keyof S,
    selections: T[],
    name?: string,
    default?: T,
} | {
    type: 'button',
    name: string,
    action: T,
}

export abstract class Applet<S, M = {}> extends React.Component<M, S> {
    viewData: S & M = {} as any;
    state: S = {} as any;

    private storeSub: any = null;

    private mapped: M = {} as any;
    private _ref = React.createRef<HTMLDivElement>();
    private settings: AppletSetting<S>[] = [];

    constructor(
        public props: any,
        public mapper?: (s: State) => M
    ) {
        super(props);

        if (!this.onViewData) {
            console.log('this:', this);
            throw new Error('onViewData() not implemented');
        }

        if (!this.initialize) {
            console.log('this:', this);
            throw new Error('initialize() not implemented');
        }

        if (mapper) {
            this.mapped = mapper(store.getState());
            this.viewData = {...this.state, ...this.mapped};
        };
    }

    renderSettings(settings: AppletSetting<S>[]) {
        settings.forEach(set => {
            if (set.type === 'options' && !this.state[set.key]) {
                const def = set.default || set.selections[0];
                if (!def) return;

                this.state[set.key] = def as any;
            }
        });

        if (this.settings !== settings) {
            this.settings = settings;
            this.forceUpdate(); // ???????
        }
    }

    render = () => <>
        {this.settings.map((set) => {
            if (set.type === 'button') {
                return <button onClick={() => (this.onAction as any)({ type: set.action })}>
                    {set.name}
                </button>;
            }

            if (set.type === 'options')
                return (<>
                {set.name ? <label>{set.name ? set.name : ''}</label> : null}
                    <select
                        value={this.state[set.key] as any}
                        onChange={(e) => this.setState({ [set.key]: e.target.value } as any)}
                    >
                        {set.selections.map((slc) => <option value={slc}>{slc}</option>)}
                    </select>
                </>);

            return null;
        })}
        <div
            className="applet-container"
            ref={this._ref}
        />
    </>;

    triggerView = (mapped: M, state: S) => {
        const prev = this.viewData;
        this.viewData = { ...mapped, ...state };

        this.onViewData(this.viewData, prev);
    }

    componentDidMount() {
        if (!this._ref.current) throw new Error('<div /> container element did not render');

        if (this.mapper) this.storeSub = store.stateSub(true, (s) => {
            const mapped = (this.mapper as (s: State) => M)(s);
            if (equal(this.mapped, mapped)) return;

            this.triggerView(mapped, this.state);
        });

        this.initialize(this._ref.current, { ...this.mapped, ...this.state });
    }

    componentDidUpdate() {
        this.triggerView(this.mapped, this.state);
    }

    componentWillUnmount() {
        if (!this.onAction) return;
        this.storeSub.unsubscribe();
        this.onAction({ type: 'DESTROY_APPLET' });
    }

    abstract initialize(container: HTMLDivElement, viewData?: S & M): any;
    abstract onViewData(viewData: S & M, prevViewData: S & M): any;
    abstract onAction?<T = { type: string; data?: any }>(a: T): any;
}
