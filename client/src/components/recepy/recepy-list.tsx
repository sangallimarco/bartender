import * as React from 'react';
import { webSocketService, WebSocketListener } from '../../core/websocket';
import './recepy.css';
import { RECEPIES, ProcessingPayload, RecepyPayload, RecepiesPayload, RecepyOption, MakePayload } from '../../shared';
import RecepyItem from './recepy-item';
import Dialog from '../dialog/dialog';
import Processing from '../processing/processing';
import { BaseComponent } from '../../core/base-component';
import { browserHistory } from '../../core/browser-history';
import { IRootState, RootActions, RootAction } from '../../stores';
import { Dispatch, bindActionCreators, } from 'redux';
import { connect } from 'react-redux';

interface RecepyListStateProps {
    processing: boolean,
    recepies: RecepyOption[]
    message: string;
    id: string;
    dialogVisible: boolean;
    edit: boolean;
};

class RecepyListBase extends BaseComponent<{}, RecepyListStateProps> {

    public state: RecepyListStateProps = {
        dialogVisible: false,
        edit: false,
        id: '',
        message: '',
        processing: false,
        recepies: []
    }

    public componentDidMount() {
        this.listeners.push(
            webSocketService.on<ProcessingPayload>(Action.MAKE, (data) => {
                const { processing } = data;
                this.setState({ processing });
            })
        );
        this.listeners.push(
            webSocketService.on<RecepiesPayload>(Action.RECEPIES, (data) => {
                const { recepies } = data;
                this.setState({ recepies });
            })
        );
        this.listeners.push(
            webSocketService.on<RecepyPayload>(Action.NEW, (data) => {
                const { recepy: { id } } = data;
                browserHistory.push(`/edit/${id}`);
            })
        );
        webSocketService.send<{}>(Action.RECEPIES, {});

        // enable edit mode
        document.addEventListener('keydown', this.handleKeyDown);
    }

    public componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
        this.listeners.map((i: WebSocketListener) => i());
    }

    public render() {
        const { processing, recepies, message, dialogVisible } = this.state;
        return (
            <div className="recepy-list">
                {this.renderItems(recepies)}
                {JSON.stringify(processing)}
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
            case 'n':
                webSocketService.send<{}>(Action.NEW, {});
                break;
        }
    }

    private handleConfirm = () => {
        const { id } = this.state;
        webSocketService.send<MakePayload>(Action.MAKE, { id });
        this.setState({ dialogVisible: false });
    }

    private handleDismiss = () => {
        this.setState({ dialogVisible: false });
    }

    private handleSelected = (id: string, label: string) => {
        const { edit } = this.state;
        if (edit) {
            browserHistory.push(`/edit/${id}`);
        } else {
            const message = `Confirm ${label}?`;
            this.setState({ id, dialogVisible: true, message });
        }
    }

    private renderItems(items: RecepyOption[]) {
        return items.map((i: RecepyOption) => {
            const { label, id } = i;
            return <RecepyItem key={id} label={label} id={id} onClick={this.handleSelected} />;
        })
    }
}

const mapStateToProps = (state: IRootState) => ({
    recepies: state.root.recepies,
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => bindActionCreators({
    getAll: RootActions.RECEPIES,
}, dispatch);

export const RecepyList = connect(mapStateToProps, mapDispatchToProps)(RecepyListBase);