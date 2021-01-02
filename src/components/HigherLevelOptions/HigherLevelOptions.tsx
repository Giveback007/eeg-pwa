import { Button } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import React, { ChangeEvent, ChangeEventHandler, MouseEvent } from 'react';
import { Acts } from 'src/data/actions/index.actions';
import { icons } from '../icons';

type S = {
    chanView: string;
    chanTags: string;
    bapLower: string;
    bapUpper: string
}

type P = {

}

export class HigherLevelOptions extends React.Component<P, S> {
    state: S = {
        chanView: '',
        chanTags: '',
        bapLower: '',
        bapUpper: '',
    };

    handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        this.setState({ [name]: value } as any)
    }

    handleButtonClick = (type: 'TAGS' | 'VIEW' | 'BAPS') => {
        switch (type) {
            case 'TAGS':
                Acts.ChannelTagsSet(this.state.chanTags);

                return this.setState({ chanTags: ''});
            case 'VIEW':
                Acts.ChannelViewSet(this.state.chanView);

                return this.setState({ chanView: '' });
            case 'BAPS':
                Acts.BandpassSet({
                    lower: Number(this.state.bapLower),
                    upper: Number(this.state.bapUpper)
                });

                return this.setState({ bapLower: '', bapUpper: '' })
        }
    }

    render() {
        const { bapLower, bapUpper, chanTags, chanView } = this.state;
        return <div id="higher-level">
            {/* Set channel view */}
            <div>
                <TextField
                    name="chanTags"
                    value={chanTags}
                    onChange={this.handleInputChange}
                    label="Set Channel View"
                    placeholder="Format: 0,1,2,5,6,7,etc"
                    variant="outlined"
                />
                <Button
                    variant="contained"
                    color="primary"
                    // className={classes.button}
                    startIcon={<icons.AddCircle />}
                    onClick={() => this.handleButtonClick('TAGS')}
                >Set</Button>
            </div>

            {/* Set tags */}
            <div>
                <TextField
                    name="chanView"
                    value={chanView}
                    onChange={this.handleInputChange}
                    label="Set Channel View"
                    placeholder="Format: 0:Fp1;2:Fz;6:P6:0,1,2;etc"
                    variant="outlined"
                />
                <Button
                    variant="contained"
                    color="primary"
                    // className={classes.button}
                    startIcon={<icons.AddCircle />}
                    onClick={() => this.handleButtonClick('VIEW')}
                >Set</Button>
            </div>

            {/* Set bandpass */}
            <div>
                <TextField
                    name="bapLower"
                    value={bapLower}
                    onChange={this.handleInputChange}
                    type="number"
                    label="Bandpass Lower"
                    variant="outlined"
                />
                <TextField
                    name="bapUpper"
                    value={bapUpper}
                    onChange={this.handleInputChange}
                    type="number"
                    label="Bandpass Upper"
                    variant="outlined"
                />
                <Button
                    variant="contained"
                    color="primary"
                    // className={classes.button}
                    startIcon={<icons.AddCircle />}
                    onClick={() => this.handleButtonClick('BAPS')}
                >Set</Button>
            </div>
        </div>
    }
}
