import React from 'react';
import { linker, State } from '../data/store';


// type S = { };
// type P = { } & ReturnType<typeof link>;

// function Applet() {
//     return <div className="applet">

//     </div>
// }

function Dasboard() {
    return <>
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
    </>
}

const link = (_s: State) => ({  });
export default linker(link, Dasboard);
