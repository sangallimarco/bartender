import * as React from 'react';
import { BaseComponent } from '../../core/base-component';
import { RouteComponentProps } from '../../../node_modules/@types/react-router';
import { RoutePath, Recepy, GetPayload, RecepyPayload, RecepyFamiliesPayload, RecepyFamily, Pump } from '../../shared';
import { webSocketService } from '../../core/websocket';
import Button, { ButtonType } from '../button/button';
import { Input } from '../input/input';
// import { RoutePath } from '../../shared';
import './recepy-edit.css';
import { generateRangeFromEnumKeys } from '../../core/enum-utils';

interface RecepyEditProps extends RouteComponentProps<any> {
    id: string;
}

interface RecepyEditState {
    recepy: Recepy;
    families: RecepyFamily[],
    loaded: boolean
}

export class RecepyEdit extends BaseComponent<RecepyEditProps, RecepyEditState> {
    public state = {
        families: [],
        loaded: false,
        recepy: {
            id: '',
            label: '',
            parts: [0],
            recepyFamily: 'default'
        },
    };

    public componentDidMount() {
        const { match: { params: { id } } } = this.props;
        this.listeners.push(
            webSocketService.on<RecepyPayload>(RoutePath.GET, (data) => {
                const { recepy } = data;
                this.setState({ recepy, loaded: true });

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
        const { recepy: { label, parts }, families, loaded } = this.state;
        return loaded && <div className="recepy-edit">
            <Input name="label" value={label} onChange={this.handleChange} />
            <Input name="label" value={label} onChange={this.handleChange} />
            {this.renderPumps(parts)}
            <Button onClick={this.handleSubmit} type={ButtonType.ACTION}>SAVE</Button>
            <div>{JSON.stringify(families)}</div>
        </div>;
    }

    private renderPumps(parts: number[]) {
        return generateRangeFromEnumKeys(Pump).map((i: number, indx: number) => {
            const name = `${i}`;
            const value = parts[i] || 0;
            return <Input key={name} name={name} value={value.toString()} onChange={this.handlePumpChange} />
        });
    }

    private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { recepy: prevRecepy } = this.state;
        const { target: { value, name } } = e;
        const recepy: Recepy = { ...prevRecepy, [name]: value };
        this.setState({ recepy })
    }

    private handleSubmit = () => {
        const { recepy } = this.state;
        webSocketService.send<RecepyPayload>(RoutePath.EDIT, { recepy });
    }

    private handlePumpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { recepy: prevRecepy } = this.state;
        const { target: { value, name } } = e;
        const indx = +name;
        const quantity = +value;
        const {parts} = prevRecepy;
        parts.splice(indx, 1, quantity);
        const recepy: Recepy = { ...prevRecepy, parts };
        this.setState({ recepy })
    }
}