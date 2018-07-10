import { webSocketService, WebSocketListener } from '../../core/websocket';
import * as React from 'react';
import './recepy.css';
import { RoutePath } from '../../shared/route-path';

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
                TEST here {JSON.stringify(processing)}
                recepies {JSON.stringify(recepies)}
                <button onClick={this.handleClick}>CLICK</button>
                <button onClick={this.handleClickLoad}>CLICK</button>
            </div>
        );
    }

    private handleClick = () => {
        webSocketService.send(RoutePath.MAKE, { name: 'gintonic' });
    }

    private handleClickLoad = () => {
        webSocketService.send(RoutePath.RECEPIES, {});
    }
}