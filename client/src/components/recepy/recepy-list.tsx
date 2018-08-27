import * as React from 'react';
import './recepy.css';
import RecepyItem from './recepy-item';
import Dialog from '../dialog/dialog';
import Processing from '../processing/processing';
import { browserHistory } from '../../core/browser-history';
import { RootState, RootActions, RootAction } from '../../stores';
import { Dispatch, bindActionCreators, } from 'redux';
import { connect } from 'react-redux';
import { Recepy } from '../../shared';

interface RecepyListBaseProps {
    recepies: Recepy[];
    recepy: Recepy;
    processing: boolean;
    make: () => void;
    setRecepy: (recepy: Recepy) => void;
}

interface RecepyListBaseState {
    edit: boolean;
    dialogVisible: boolean;
    message: string;
}

class RecepyListBase extends React.Component<RecepyListBaseProps, RecepyListBaseState> {

    public state = {
        dialogVisible: false,
        edit: false,
        message: ''
    };

    public componentDidMount() {
        // enable edit mode
        document.addEventListener('keydown', this.handleKeyDown);
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
        switch (key) {
            case 'e':
                this.setState({ edit: true });
                break;
            // case 'n':
            //     webSocketService.send<{}>(NEW, {});
            //     break;
        }
    }

    private handleConfirm = () => {
        const { make } = this.props;
        make();
        this.setState({ dialogVisible: false });
    }

    private handleDismiss = () => {
        this.setState({ dialogVisible: false });
    }

    private handleSelected = (recepy: Recepy) => {
        const { setRecepy } = this.props;
        const { edit } = this.state;
        const { label } = recepy;
        setRecepy(recepy);
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

const mapStateToProps = (state: RootState) => {
    const {
        root: { processing, recepies }
    } = state;
    return { processing, recepies };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => bindActionCreators({
    make: RootActions.CMD_MAKE,
    setRecepy: RootActions.SET_RECEPY
}, dispatch);

export const RecepyList = connect(mapStateToProps, mapDispatchToProps)(RecepyListBase);