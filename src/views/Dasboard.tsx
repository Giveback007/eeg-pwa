import React from 'react';
import { Menu } from '../components/Menu/Menu';
import { linker, State, store } from '../data/store';

type S = { };
type P = { } & ReturnType<typeof link>;


// THIS WILL BE DYNAMIC
class Dasboard extends React.Component<P, S> {

    render() {
        this.props.children
        return <>
            <Menu />
        </>
    }
}

const link = (s: State) => ({  });
export default linker(link, Dasboard);
