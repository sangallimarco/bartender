import * as React from 'react';
import { webSocketService, WebSocketListener } from '../../core/websocket';
import './recepy.css';
import { RoutePath, ProcessingPayload, RecepiesPayload, RecepyOption, MakePayload } from '../../shared';
import RecepyItem from './recepy-item';
import Dialog from '../dialog/dialog';
import Processing from '../processing/processing';
import { BaseComponent } from '../../core/base-component';
import { browserHistory } from '../../core/browser-history';

interface RecepyListStateProps {
    processing: boolean,
    recepies: RecepyOption[]
    message: string;
    id: string;
    dialogVisible: boolean;
    edit: boolean;
};

export class RecepyList extends BaseComponent<{}, RecepyListStateProps> {

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
            webSocketService.on<ProcessingPayload>(RoutePath.MAKE, (data) => {
                const { processing } = data;
                this.setState({ processing });
            })
        );
        this.listeners.push(
            webSocketService.on<RecepiesPayload>(RoutePath.RECEPIES, (data) => {
                const { recepies } = data;
                this.setState({ recepies });
            })
        );
        webSocketService.send<{}>(RoutePath.RECEPIES, {});

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
        if (key === 'e') {
            this.setState({ edit: true });
        }
    }

    private handleConfirm = () => {
        const { id } = this.state;
        webSocketService.send<MakePayload>(RoutePath.MAKE, { id });
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