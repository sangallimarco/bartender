import { webSocketService, WebSocketListener } from '../../core/websocket';
import * as React from 'react';
import './recepy.css';
import { RoutePath } from '../../shared/route-path';
import RecepyItem from './recepy-item';

interface RecepyListProps {
    processing: boolean,
    recepies: RecepyOption[]
};

interface RecepyOption {
    id: string;
    label: string;
}

interface ProcessingData {
    processing: boolean;
}

interface RecepiesData {
    recepies: RecepyOption[];
}

export class RecepyList extends React.Component<{}, RecepyListProps> {

    public state: RecepyListProps = {
        processing: false,
        recepies: []
    }

    private listeners: WebSocketListener[] = [];

    public componentDidMount() {
        this.listeners.push(
            webSocketService.on<ProcessingData>(RoutePath.MAKE, (data) => {
                const { processing } = data;
                this.setState({ processing });
            })
        );
        this.listeners.push(
            webSocketService.on<RecepiesData>(RoutePath.RECEPIES, (data) => {
                const { recepies } = data;
                this.setState({ recepies });
            })
        );

        webSocketService.send(RoutePath.RECEPIES, {});
    }

    public componentWillUnmount() {
        this.listeners.forEach((i) => i());
    }

    public render() {
        const { processing, recepies } = this.state;
        return (
            <div className="App">
                {this.renderItems(recepies)}
                {JSON.stringify(processing)}
            </div>
        );
    }

    private HandleSelected = (id: string) => {
        webSocketService.send(RoutePath.MAKE, { name: 'gintonic' });
    }

    private renderItems(items: RecepyOption[]) {
        return items.map((i: RecepyOption) => {
            const { label, id } = i;
            return <RecepyItem key={id} label={label} id={id} onClick={this.HandleSelected} />;
        })
    }
}