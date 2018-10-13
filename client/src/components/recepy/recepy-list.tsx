import * as React from 'react';
import './recepy-list.css';
import RecepyItem from './recepy-item';
import Dialog from '../dialog/dialog';
import Processing from '../processing/processing';
import { browserHistory } from '../../core/browser-history';
import { RootState } from '../../stores';
import { connect } from 'react-redux';
import { Recepy, RootActions, RootAction, RecepyFamily } from '../../types';
// import { Dispatch } from 'redux';
import { ReduxDispatch } from '../../core/types';
import { getCurrentFamily } from './recepy-utils';
import { ROUTE } from '../../routes';

interface ReduxProps {
    recepies: Recepy[];
    recepy: Recepy | null;
    processing: boolean;
    families: RecepyFamily[];
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
        const { recepies, processing, families } = this.props;
        const { dialogVisible, message } = this.state;
        return (
            <div className="recepy__list">
                {this.renderItems(recepies, families)}
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
                browserHistory.push(ROUTE.edit);
                break;
        }
    }

    private handleConfirm = () => {
        const { dispatch, recepy } = this.props;
        if (recepy) {
            dispatch(RootActions.CMD_MAKE({ recepy }));
        }
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
            browserHistory.push(ROUTE.edit);
        } else {
            const message = `Confirm ${label}?`;
            this.setState({ dialogVisible: true, message });
        }
    }

    private renderItems(items: Recepy[], families: RecepyFamily[]) {
        return items.map((recepy: Recepy) => {
            const { id } = recepy;
            const family = getCurrentFamily(families, recepy);
            if (family) {
                const { ingredients } = family;
                return <RecepyItem key={id} recepy={recepy} ingredients={ingredients} onClick={this.handleSelected} />;
            }
            return null;
        })
    }
}

const mapStateToProps = (state: RootState): ReduxProps => {
    const {
        root: { processing, recepies, recepy, families }
    } = state;
    return { processing, recepies, recepy, families };
};

export const RecepyList = connect(mapStateToProps)(RecepyListBase);
