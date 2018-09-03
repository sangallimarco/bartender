import * as React from 'react';
import './recepy.css';
import RecepyItem from './recepy-item';
import Dialog from '../dialog/dialog';
import Processing from '../processing/processing';
import { browserHistory } from '../../core/browser-history';
import { RootState, RootAction, RootActions } from '../../stores';
import { connect } from 'react-redux';
import { Recepy } from '../../stores/types';
// import { Dispatch } from 'redux';
import { ReduxDispatch } from '../../core/types';

interface ReduxProps {
    recepies: Recepy[];
    recepy: Recepy | null;
    processing: boolean;
}

interface RecepyListBaseState {
    edit: boolean;
    dialogVisible: boolean;
    message: string;
}

class RecepyListBase extends React.Component<ReduxProps & ReduxDispatch<RootAction>, RecepyListBaseState> {

    public state = {
        dialogVisible: false,
        edit: false,
        message: ''
    };

    public componentDidMount() {
        // enable edit mode
        document.addEventListener('keydown', this.handleKeyDown);
    }

    public componentWillUnmount() {
        // enable edit mode
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    public render() {
        const { recepies, processing } = this.props;
        const { dialogVisible, message } = this.state;
        return (
            <div className="recepy-list">
                {this.renderItems(recepies)}
                <Dialog active={dialogVisible} onConfirm={this.handleConfirm} onDismiss={this.handleDismiss} message={message} />
                <Processing active={processing} />
            </div>
        );
    }

    public handleKeyDown = (e: KeyboardEvent) => {
        const { key } = e;
        const { dispatch } = this.props;
        switch (key) {
            case 'e':
                this.setState({ edit: true });
                break;
            case 'n':
                dispatch(RootActions.CMD_NEW());
                browserHistory.push(`/edit`);
                break;
        }
    }

    private handleConfirm = () => {
        const { dispatch } = this.props;
        dispatch(RootActions.CMD_MAKE());
        this.setState({ dialogVisible: false });
    }

    private handleDismiss = () => {
        this.setState({ dialogVisible: false });
    }

    private handleSelected = (recepy: Recepy) => {
        const { dispatch } = this.props;
        const { edit } = this.state;
        const { label } = recepy;
        dispatch(RootActions.SET_RECEPY(recepy));
        if (edit) {
            browserHistory.push(`/edit`);
        } else {
            const message = `Confirm ${label}?`;
            this.setState({ dialogVisible: true, message });
        }
    }

    private renderItems(items: Recepy[]) {
        return items.map((recepy: Recepy) => {
            const { id } = recepy;
            return <RecepyItem key={id} recepy={recepy} onClick={this.handleSelected} />;
        })
    }
}

const mapStateToProps = (state: RootState): ReduxProps => {
    const {
        root: { processing, recepies, recepy }
    } = state;
    return { processing, recepies, recepy };
};

export const RecepyList = connect(mapStateToProps)(RecepyListBase);
