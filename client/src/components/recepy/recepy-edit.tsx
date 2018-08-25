import * as React from 'react';
import { BaseComponent } from '../../core/base-component';
import { RouteComponentProps } from '../../../node_modules/@types/react-router';
import { GET, GET_FAMILIES, EDIT, Recepy, GetPayload, RecepyPayload, RecepyFamiliesPayload, RecepyFamily, Pump } from '../../shared';
import { webSocketService, WebSocketListener } from '../../core/websocket';
import Button, { ButtonType } from '../button/button';
import { Input } from '../input/input';
import './recepy-edit.css';
import { generateRangeFromEnumKeys } from '../../core/enum-utils';
import { browserHistory } from '../../core/browser-history';
import { Select } from '../select/select';
import InputContainer from '../input-container/input-container';
import { cloneDeep } from 'lodash';
import { getCurrentFamilyIngredients } from './recepy-utils';

interface RecepyEditProps extends RouteComponentProps<any> {
    id: string;
}

interface RecepyEditState {
    recepy: Recepy | undefined;
    families: RecepyFamily[] | undefined;
}

export class RecepyEdit extends BaseComponent<RecepyEditProps, RecepyEditState> {
    public state = {
        families: undefined,
        recepy: undefined
    };

    public componentDidMount() {
        const { match: { params: { id } } } = this.props;
        this.listeners.push(
            webSocketService.on<RecepyPayload>(GET, (data) => {
                const { recepy } = data;
                this.setState({ recepy });

            })
        );
        this.listeners.push(
            webSocketService.on<RecepyFamiliesPayload>(GET_FAMILIES, (data) => {
                const { families } = data;
                this.setState({ families });
            })
        );
        this.listeners.push(
            webSocketService.on<{}>(EDIT, (data) => {
                browserHistory.push('/');
            })
        );

        webSocketService.send<GetPayload>(GET, { id });
        webSocketService.send<{}>(GET_FAMILIES, {});
    }

    public componentWillUnmount() {
        this.listeners.map((i: WebSocketListener) => i());
    }

    public render() {
        const { recepy, families } = this.state;
        if (recepy && families) {
            const { label, parts, recepyFamily } = recepy as Recepy;
            return <div className="recepy-edit">
                <InputContainer label="Label">
                    <Input name="label" value={label} onChange={this.handleChange} />
                </InputContainer>
                <InputContainer label="Label">
                    <Select name="recepyFamily" value={recepyFamily} onChange={this.handleSelect} options={families} />
                </InputContainer>
                {this.renderPumps(parts)}
                <Button onClick={this.handleSubmit} type={ButtonType.ACTION}>SAVE</Button>
            </div>;
        }
        return null;
    }

    private renderPumps(parts: number[]) {
        const { families, recepy } = this.state;
        if (families && recepy) {
            const ingredients = getCurrentFamilyIngredients(families, recepy);
            const range = generateRangeFromEnumKeys(Pump);
            return range.map((i: number, indx: number) => {
                const name = `${i}`;
                const value = parts[i] || 0;
                const label = ingredients[i];
                return <InputContainer key={name} label={label}>
                    <Input name={name} value={value.toString()} onChange={this.handlePumpChange} />
                </InputContainer>;
            });
        }
        return null;
    }

    private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { recepy: prevRecepy } = this.state;
        const { target: { value, name } } = e;
        if (prevRecepy) {
            const newRecepy = cloneDeep<Recepy>(prevRecepy);
            const recepy: Recepy = { ...newRecepy, [name]: value };
            this.setState({ recepy })
        }
    }

    private handleSubmit = () => {
        const { recepy } = this.state;
        if (recepy) {
            webSocketService.send<RecepyPayload>(EDIT, { recepy });
        }
    }

    private handlePumpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { recepy: prevRecepy } = this.state;
        if (prevRecepy) {
            const { target: { value, name } } = e;
            const indx = +name;
            const quantity = +value;
            const { parts } = prevRecepy as Recepy;
            parts.splice(indx, 1, quantity);
            const newRecepy = cloneDeep<Recepy>(prevRecepy);
            const recepy: Recepy = { ...newRecepy, parts };
            this.setState({ recepy });
        }
    }

    private handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { recepy: prevRecepy } = this.state;
        if (prevRecepy) {
            const { target: { value, name } } = e;
            const newRecepy = cloneDeep<Recepy>(prevRecepy);
            const recepy: Recepy = { ...newRecepy, [name]: value };
            this.setState({ recepy });
        }
    }
}