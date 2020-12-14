import React from 'react';
import type { State } from 'src/data/store';

export abstract class Applet<P, S, M = {}> extends React.Component<P, S> {
    private _ref = React.createRef<HTMLDivElement>();

    constructor(
        public props: P,
        public initState: S,
        public mapper?: (s: State) => M
    ) {
        super(props);

        if (!this.onRender) throw new Error('onRender() not implemented');
        if (!this.initialize) throw new Error('initialize() not implemented');
    }

    // shouldComponentUpdate = () => false;

    render = () => <div
        className="applet-container"
        ref={this._ref}
    />

    componentDidMount() {
        if (!this._ref.current) throw new Error('<div /> container element did not render');
        this.initialize(this._ref.current, this.props, this.state);
    }

    componentDidUpdate(prevProps: P, prevState: S) {
        this.onRender(this.props, this.state, prevProps, prevState);
    }

    componentWillUnmount() {
        if (!this.onAction) return;
        this.onAction({ type: 'DESTROY_APPLET' })
    }

    abstract initialize(container: HTMLDivElement, props?: P, state?: S): any;
    abstract onRender(props: P, state: S, prevProps: P, prevState: S): any;
    abstract onAction?<T = { type: string; data?: any }>(a: T): any;
}
