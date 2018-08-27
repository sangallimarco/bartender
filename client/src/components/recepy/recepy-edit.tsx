import * as React from 'react';
import { BaseComponent } from '../../core/base-component';
import { RouteComponentProps } from '../../../node_modules/@types/react-router';
import { RootState, RootActions, RootAction } from '../../stores';
import { Recepy, RecepyPayload, RecepyFamily, Pump } from '../../shared';
import Button, { ButtonType } from '../button/button';
import { Input } from '../input/input';
import './recepy-edit.css';
import { generateRangeFromEnumKeys } from '../../core/enum-utils';
// import { browserHistory } from '../../core/browser-history';
import { Dispatch, bindActionCreators, } from 'redux';
import { connect } from 'react-redux';
import { Select } from '../select/select';
import InputContainer from '../input-container/input-container';
import { getCurrentFamilyIngredients } from './recepy-utils';

interface RecepyEditBaseProps extends RouteComponentProps<any> {
    id: string;
    recepy: Recepy | null;
    families: RecepyFamily[] | undefined;
    update: (recepy: Recepy) => void;
    submit: (recepy: RecepyPayload) => void;
}

export class RecepyEditBase extends BaseComponent<RecepyEditBaseProps, {}> {

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
                <Button onClick={this.handleSubmit} type={ButtonType.ACTION}>SAVE</Button>
            </div>;
        }
        return null;
    }

    private renderPumps(parts: number[]) {
        const { families, recepy } = this.props;
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
        const { recepy, update } = this.props;
        const { target: { value, name } } = e;
        if (recepy) {
            update({ ...recepy, [name]: value })
        }
    }

    private handleSubmit = () => {
        const { recepy, submit } = this.props;
        if (recepy) {
            submit({ recepy });
        }
    }

    private handlePumpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { recepy, update } = this.props;
        if (recepy) {
            const { target: { value, name } } = e;
            const indx = +name;
            const quantity = +value;
            const { parts } = recepy;
            parts.splice(indx, 1, quantity);
            update({ ...recepy, parts });
        }
    }

    private handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { recepy, update } = this.props;
        if (recepy) {
            const { target: { value, name } } = e;
            update({ ...recepy, [name]: value });
        }
    }
}

const mapStateToProps = (state: RootState) => {
    const {
        root: { recepy, families }
    } = state;
    return { recepy, families };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => bindActionCreators({
    submit: RootActions.CMD_EDIT,
    update: RootActions.SET_RECEPY
}, dispatch);

export const RecepyEdit = connect(mapStateToProps, mapDispatchToProps)(RecepyEditBase);