import './HigherLevelOptions.style.sass';
import { Button, Drawer } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import { Actions } from 'src/data/actions/index.actions';
import { icons } from '../icons';
import { store } from 'src/data/store';

// added this to trigger type errors on incomplete change.
const channelView = 'channelView';
const channelTags = 'channelTags';
const bpassLower = 'bpassLower';
const bpassUpper = 'bpassUpper';

type S = {
    channelView: string;
    channelTags: string;
    bpassLower: string;
    bpassUpper: string;
    opened: boolean;
}

type P = {

}

export class HigherLevelOptions extends React.Component<P, S> {
    state: S = {
        channelView: '',
        channelTags: '',
        bpassLower: '',
        bpassUpper: '',
        opened: false,
    };

    x = store.actionSub('TOP_OPTS_TOGGLE', () => this.setState({ opened: !this.state.opened }))

    handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        this.setState({ [name]: value } as any)
    }

    handleButtonClick = (type: 'TAGS' | 'VIEW' | 'BPASS') => {
        switch (type) {
            case 'TAGS':
                Actions.CHANNEL_TAGS_SET(this.state.channelTags);
                return this.setState({ channelTags: '' });
            case 'VIEW':
                Actions.CHANNEL_VIEW_SET(this.state.channelView);
                return this.setState({ channelView: '' });
            case 'BPASS':
                Actions.BANDPASS_SET({
                    freqStart: Number(this.state.bpassLower),
                    freqEnd: Number(this.state.bpassUpper)
                });

                return this.setState({ bpassLower: '', bpassUpper: '' });
        }
    }

    render() {
        const s = this.state;

        return <Drawer
            anchor="top"
            open={s.opened}
            onClose={() => this.setState({ opened: false })}
        ><div id="higher-level-options">
            {/* Set channel view */}
            <div className="hlo-row">
                <TextField
                    name={channelTags}
                    value={s[channelTags]}
                    onChange={this.handleInputChange}
                    className="hlo-input"
                    label="Set Channel Tags"
                    placeholder="Format: 0,1,2,5,6,7,etc"
                    variant="outlined"
                />
                <Button
                    variant="contained"
                    color="primary"
                    className="hlo-btn"
                    startIcon={<icons.AddCircle />}
                    onClick={() => this.handleButtonClick('TAGS')}
                >Set</Button>
            </div>

            {/* Set tags */}
            <div className="hlo-row">
                <TextField
                    name={channelView}
                    value={s[channelView]}
                    onChange={this.handleInputChange}
                    className="hlo-input"
                    label="Set Channel View"
                    placeholder="Format: 0:Fp1;2:Fz;6:P6:0,1,2;etc"
                    variant="outlined"
                />
                <Button
                    variant="contained"
                    color="primary"
                    className="hlo-btn"
                    startIcon={<icons.AddCircle />}
                    onClick={() => this.handleButtonClick('VIEW')}
                >Set</Button>
            </div>

            {/* Set bandpass */}
            <div className="hlo-row">
                <TextField
                    name={bpassLower}
                    value={s[bpassLower]}
                    onChange={this.handleInputChange}
                    className="hlo-input"
                    type="number"
                    label="Bandpass Lower"
                    variant="outlined"
                />
                <TextField
                    name={bpassUpper}
                    value={s[bpassUpper]}
                    onChange={this.handleInputChange}
                    className="hlo-input"
                    type="number"
                    label="Bandpass Upper"
                    variant="outlined"
                />
                <Button
                    variant="contained"
                    color="primary"
                    className="hlo-btn"
                    startIcon={<icons.AddCircle />}
                    onClick={() => this.handleButtonClick('BPASS')}
                >Set</Button>
            </div></div>
        </Drawer>
    }
}
