import React from 'react';
import { BasicPlotExample } from 'src/components/BasicExample/BasicExample';
import { HigherLevelOptions } from 'src/components/HigherLevelOptions/HigherLevelOptions';
// import { SmoothPlotComponent } from 'src/components/SmoothiePlot/SmoothiePlot';
import { linker, State } from '../data/store';


// type S = { };
// type P = { } & ReturnType<typeof link>;

function Dashboard() {
    return <>
        <HigherLevelOptions/>
        {/* <h1>Dashboard</h1> */}
        <BasicPlotExample />
        {/* <SmoothPlotComponent /> */}
    </>
}

const link = (_s: State) => ({  });
export default linker(link, Dashboard);

// const x = (
//     <div className="grid">
//         <div className="grid-row">
//             <div className='grid-item'></div>
//             <div className='grid-item'></div>
//             <div className='grid-item'></div>
//             <div className='grid-item'></div>
//         </div>
//         <div className="grid-row">
//             <div className='grid-item'></div>
//             <div className='grid-item'></div>
//             <div className='grid-item'></div>
//             <div className='grid-item'></div>
//         </div>
//     </div>
// );
