import * as React from 'react';
import { BaseComponent } from '../../core/base-component';
import { RouteComponentProps } from '../../../node_modules/@types/react-router';
import { RoutePath, Recepy, GetPayload, RecepyPayload } from '../../shared';
import { webSocketService } from '../../core/websocket';
// import { webSocketService } from '../../core/websocket';
// import { RoutePath } from '../../shared';

interface RecepyEditProps extends RouteComponentProps<any> {
    id: string;
}

interface RecepyEditState {
    recepy: Recepy;
}

export class RecepyEdit extends BaseComponent<RecepyEditProps, RecepyEditState> {
    public componentDidMount() {
        const { match: { params: { id } } } = this.props;
        this.listeners.push(
            webSocketService.on<RecepyPayload>(RoutePath.GET, (data) => {
                const { recepy } = data;
                this.setState({ recepy });
            })
        );

        webSocketService.send<GetPayload>(RoutePath.GET, { id });
    }

    public render() {
        return <div>ok</div>;
    }
}