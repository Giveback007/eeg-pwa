import React from 'react';
import { linker, State } from '../data/store';
import { Button, List, ListItem } from '@material-ui/core';
import {icons} from '../components/icons';
import Navbar from 'src/components/Navbar/Navbar';

// type S = { };
type P = { } & ReturnType<typeof link>;

function Dasboard() {
    // const classes = useStyles1();
    const x = (<List>
        <ListItem>
            <Button
                href="#pablo"
                // className={classes.navLink}
                onClick={e => e.preventDefault()}
                // color="transparent"
            > <icons.PlayArrow /> </Button>
        </ListItem>
        <ListItem>
            <Button
                href="#pablo"
                // className={classes.navLink}
                onClick={e => e.preventDefault()}
                // color="transparent"
            > <icons.StopSharp /> </Button>
        </ListItem>
    </List>)
    return <>
        {/* <h1>Stuff</h1> */}
        <Navbar
            // color="dark"
            brand="Web-BCI"
            leftLinks={x}
        />
    </>
}

// // THIS WILL BE DYNAMIC
// class Dasboard extends React.Component<P, {}> {

//     render() {

//     }
// }

const link = (_s: State) => ({  });
export default linker(link, Dasboard);
