import React from 'react';
import { BasicPlotExample } from 'src/components/BasicExample/BasicExample';
import { SmoothPlotComponent } from 'src/components/SmoothiePlot/SmoothiePlot';
import { linker, State } from '../data/store';


// type S = { };
// type P = { } & ReturnType<typeof link>;

<<<<<<< Updated upstream
function Dasboard() {
=======


class SomeCode<P, S> extends Applet<P, S> {

    myDivElement: HTMLDivElement;

    constructor(props: P) { super(props, {} as S); }

    initialize(container: HTMLDivElement, props: P, state: S) {
        this.myDivElement = container;

        this.myDivElement.innerHTML = `<div>
            I can do what ever I want with this
        </div>`
    }

    onRender(props: P, state: S, prevProps: P, prevState: S) {
        // local state & props
    }

    onAction(a) {
        // local actions
        switch (a.type) {
            case 'DESTROY_APPLET': {
                // clean up
            }
        }
    }
}



function Dashboard() {
>>>>>>> Stashed changes
    return <>
        {/* <h1>Dashboard</h1> */}
        <BasicPlotExample />
        {/* <SmoothPlotComponent /> */}
    </>
}

const link = (_s: State) => ({  });
export default linker(link, Dashboard);

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
