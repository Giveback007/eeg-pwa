import React from 'react';
import { linker, State } from '../data/store';

type S = { };
type P = { } & ReturnType<typeof link>;

class Settings extends React.Component<P, S> {

    render() {
        this.props.children
        return <>
            {/* <Menu /> */}
            <h1>Settings</h1>
        </>
    }
}

const link = (_s: State) => ({  });
export default linker(link, Settings);
