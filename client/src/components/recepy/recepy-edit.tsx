import * as React from 'react';
import { BaseComponent } from '../../core/base-component';
// import { webSocketService } from '../../core/websocket';
// import { RoutePath } from '../../shared';

interface RecepyEditProps {
    id: string;
}

interface RecepyEditState {
    id: string;
}

export class RecepyEdit extends BaseComponent<RecepyEditProps, RecepyEditState> {
    public componentDidMount() {
        // this.listeners.push(
        //     webSocketService.on<ProcessingPayload>(RoutePath.MAKE, (data) => {
        //         const { processing } = data;
        //         this.setState({ processing });
        //     })
        // );

        // webSocketService.send<{}>(RoutePath.RECEPY, {});
    }

    public render() {
        return <div>ok</div>;
    }
}