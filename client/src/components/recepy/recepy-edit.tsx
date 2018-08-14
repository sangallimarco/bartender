import * as React from 'react';
import { BaseComponent } from '../../core/base-component';
import { RouteComponentProps } from '../../../node_modules/@types/react-router';
import { RoutePath, Recepy, GetPayload, RecepyPayload, RecepyFamiliesPayload, RecepyFamily } from '../../shared';
import { webSocketService } from '../../core/websocket';
import Button, { ButtonType } from '../button/button';
import { Input } from '../input/input';
// import { RoutePath } from '../../shared';
import './recepy-edit.css';

interface RecepyEditProps extends RouteComponentProps<any> {
    id: string;
}

interface RecepyEditState {
    recepy: Recepy;
    families: RecepyFamily[]
}

export class RecepyEdit extends BaseComponent<RecepyEditProps, RecepyEditState> {
    public state = {
        families: [],
        recepy: {
            id: '',
            label: '',
            parts: [],
            recepyFamily: 'default'
        },
    };

    // public constructor() {

    // }

    public componentDidMount() {
        const { match: { params: { id } } } = this.props;
        this.listeners.push(
            webSocketService.on<RecepyPayload>(RoutePath.GET, (data) => {
                const { recepy } = data;
                this.setState({ recepy });
            })
        );
        this.listeners.push(
            webSocketService.on<RecepyFamiliesPayload>(RoutePath.GET_FAMILIES, (data) => {
                const { families } = data;
                this.setState({ families });
            })
        );

        // this.listeners.push(
        //     webSocketService.on<RecepyPayload>(RoutePath.EDIT, (data) => {
        //         const { recepy } = data;
        //         this.setState({ recepy });
        //     })
        // );

        webSocketService.send<GetPayload>(RoutePath.GET, { id });
        webSocketService.send<{}>(RoutePath.GET_FAMILIES, {});
    }

    public render() {
        const { recepy: { label }, families } = this.state;
        return <div className="recepy-edit">
            <Input name="label" value={label} onChange={this.handleChange} />
            <Input name="label" value={label} onChange={this.handleChange} />
            <Button onClick={this.handleSubmit} type={ButtonType.ACTION}>SAVE</Button>
            <div>{JSON.stringify(families)}</div>
        </div>;
    }

    private handleSubmit = () => {
        const { recepy } = this.state;
        webSocketService.send<RecepyPayload>(RoutePath.EDIT, { recepy });
    }

    private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { recepy: prevRecepy } = this.state;
        const { target: { value, name } } = e;
        const recepy: Recepy = { ...prevRecepy, [name]: value };
        this.setState({ recepy })
    }
}