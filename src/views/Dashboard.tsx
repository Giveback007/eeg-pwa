import React from 'react';
import { Applet } from 'src/components/Applet/Applet';
import { linker, State } from '../data/store';


// type S = { };
// type P = { } & ReturnType<typeof link>;



class SomeCode<P, S> extends Applet<P, S> {

    constructor(props: P) { super(props); }

    initialize(container: HTMLDivElement, props: P, state: S) {

    }

    onRender(props: P, state: S, prevProps: P, prevState: S) {
        // local state & props
    }

    onAction(a) {
        // local actions
    }
}



function Dasboard() {
    return <>

    </>
}

const link = (_s: State) => ({  });
export default linker(link, Dasboard);

const x = (
    <div className="grid">
        <div className="grid-row">
            <div className='grid-item'></div>
            <div className='grid-item'></div>
            <div className='grid-item'></div>
            <div className='grid-item'></div>
        </div>
        <div className="grid-row">
            <div className='grid-item'></div>
            <div className='grid-item'></div>
            <div className='grid-item'></div>
            <div className='grid-item'></div>
        </div>
    </div>
);
