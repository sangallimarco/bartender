import * as React from 'react';
import { WebSocketListener } from './websocket';

export class BaseComponent<P, S> extends React.Component<P,S> {
    protected listeners: WebSocketListener[] = [];

    public componentWillUnmount() {
        this.listeners.forEach((i) => i());
    }
}