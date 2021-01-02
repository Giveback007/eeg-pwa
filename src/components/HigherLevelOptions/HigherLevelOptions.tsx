import { Button } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import React, { ChangeEvent, ChangeEventHandler, MouseEvent } from 'react';
import { Actions } from 'src/data/actions/index.actions';
import { icons } from '../icons';

type S = {
    channelView: string;
    channelTags: string;
    bpassLower: string;
    bpassUpper: string
}

type P = {

}

export class HigherLevelOptions extends React.Component<P, S> {
    state: S = {
        channelView: '',
        channelTags: '',
        bpassLower: '',
        bpassUpper: '',
    };

    handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        this.setState({ [name]: value } as any)
    }

    handleButtonClick = (type: 'TAGS' | 'VIEW' | 'BPASS') => {
        switch (type) {
            case 'TAGS':
                Actions.CHANNEL_TAGS_SET(this.state.channelTags);

                return;
            case 'VIEW':
                Actions.CHANNEL_VIEW_SET(this.state.channelView);

                return;
            case 'BPASS':
                Actions.BANDPASS_SET({
                    freqStart: Number(this.state.bpassLower),
                    freqEnd: Number(this.state.bpassUpper)
                });

                return;
        }
    }

    render() {
        const { bpassLower: bpassLower, bpassUpper: bpassUpper, channelTags: channelTags, channelView: channelView } = this.state;
        return <div id="higher-level">
            {/* Set channel view */}
            <div>
                <TextField
                    name="chanTags"
                    value={channelTags}
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
                    value={channelView}
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
                    value={bpassLower}
                    onChange={this.handleInputChange}
                    type="number"
                    label="Bandpass Lower"
                    variant="outlined"
                />
                <TextField
                    name="bapUpper"
                    value={bpassUpper}
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
                    onClick={() => this.handleButtonClick('BPASS')}
                >Set</Button>
            </div>
        </div>
    }
}