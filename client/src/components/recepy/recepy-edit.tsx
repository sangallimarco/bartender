import * as React from 'react';
import { RouteComponentProps } from '../../../node_modules/@types/react-router';
import { RootState } from '../../stores';
import { Recepy, RecepyFamily, RootActions, RootAction, PumpPin } from '../../types';
import Button, { ButtonType } from '../button/button';
import { Input } from '../input/input';
import './recepy-edit.css';
import { browserHistory } from '../../core/browser-history';
import { connect } from 'react-redux';
import { Select } from '../select/select';
import InputContainer from '../input-container/input-container';
import { getCurrentFamily } from './recepy-utils';
import { ReduxDispatch } from '../../core/types';
import { ROUTE } from '../../routes';

interface ReduxProps extends RouteComponentProps<any> {
    id: string;
    recepy: Recepy | null;
    families: RecepyFamily[];
}

export class RecepyEditBase extends React.Component<ReduxProps & ReduxDispatch<RootAction>, {}> {

    public render() {
        const { recepy, families } = this.props;
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
                <Button onClick={this.handleRemove} type={ButtonType.DEFAULT}>DELETE</Button>
                <Button onClick={this.handleSubmit} type={ButtonType.ACTION}>SAVE</Button>
            </div>;
        }
        return null;
    }

    private renderPumps(parts: number[]) {
        const { families, recepy } = this.props;
        if (families && recepy) {
            const family = getCurrentFamily(families, recepy);
            if (family) {
                const { ingredients } = family;
                return PumpPin.map((i: number, indx: number) => {
                    const name = `${indx}`;
                    const value = parts[indx] || 0;
                    if (ingredients[indx]) {
                        const { label } = ingredients[indx];
                        return <InputContainer key={name} label={label}>
                            <Input name={name} value={value.toString()} onChange={this.handlePumpChange} />
                        </InputContainer>;
                    }
                    return null;
                });
            }
        }
        return null;
    }

    private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { recepy, dispatch } = this.props;
        const { target: { value, name } } = e;
        if (recepy) {
            dispatch(RootActions.SET_ATTRIBUTE({ id: name, value }))
        }
    }

    private handleRemove = () => {
        const { recepy } = this.props;
        const { dispatch } = this.props;
        if (recepy) {
            dispatch(RootActions.CMD_DELETE({ recepy }));
            browserHistory.push(ROUTE.root);
        }
    }

    private handleSubmit = () => {
        const { recepy, dispatch } = this.props;
        if (recepy) {
            dispatch(RootActions.CMD_EDIT({ recepy }));
            browserHistory.push(ROUTE.root);
        }
    }

    private handlePumpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        const { target: { value, name } } = e;
        dispatch(RootActions.SET_PART({ id: name, value }));
    }

    private handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { recepy, dispatch } = this.props;
        if (recepy) {
            const { target: { value, name } } = e;
            dispatch(RootActions.SET_ATTRIBUTE({ id: name, value }))
        }
    }
}

const mapStateToProps = (state: RootState) => {
    const {
        root: { recepy, families }
    } = state;
    return { recepy, families };
};

export const RecepyEdit = connect(mapStateToProps)(RecepyEditBase);
