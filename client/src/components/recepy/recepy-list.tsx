import * as React from 'react';
import { webSocketService} from '../../core/websocket';
import './recepy.css';
import { RoutePath, ProcessingPayload, RecepiesPayload, RecepyOption, MakePayload } from '../../shared';
import RecepyItem from './recepy-item';
import Dialog from '../dialog/dialog';
import Processing from '../processing/processing';
import { BaseComponent } from '../../core/base-component';

interface RecepyListProps {
    processing: boolean,
    recepies: RecepyOption[]
    message: string;
    id: string;
    dialogVisible: boolean;
};

export class RecepyList extends BaseComponent<{}, RecepyListProps> {

    public state: RecepyListProps = {
        dialogVisible: false,
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

    private handleConfirm = () => {
        const { id } = this.state;
        webSocketService.send<MakePayload>(RoutePath.MAKE, { id });
        this.setState({ dialogVisible: false });
    }

    private handleDismiss = () => {
        this.setState({ dialogVisible: false });
    }

    private HandleSelected = (id: string, label: string) => {
        const message = `Confirm ${label}?`;
        this.setState({ id, dialogVisible: true, message });
    }

    private renderItems(items: RecepyOption[]) {
        return items.map((i: RecepyOption) => {
            const { label, id } = i;
            return <RecepyItem key={id} label={label} id={id} onClick={this.HandleSelected} />;
        })
    }
}