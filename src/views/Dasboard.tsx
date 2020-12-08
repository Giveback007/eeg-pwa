import React from 'react';
import { linker, State } from '../data/store';

type S = { };
type P = { } & ReturnType<typeof link>;


// THIS WILL BE DYNAMIC
class Dasboard extends React.Component<P, S> {
    render() {
        this.props.children
        return <>
            {/* <Menu /> */}
            <h1>Dashboard</h1>
        </>
    }
}

const link = (s: State) => ({  });
export default linker(link, Dasboard);
