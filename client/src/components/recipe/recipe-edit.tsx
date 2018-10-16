import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { RootState } from '../../stores';
import { Recipe, RecipeFamily, RootActions, RootAction, PumpPin } from '../../types';
import Button, { ButtonType } from '../button/button';
import { Input } from '../input/input';
import './recipe-edit.css';
import { browserHistory } from '../../core/browser-history';
import { connect } from 'react-redux';
import { Select } from '../select/select';
import InputContainer from '../input-container/input-container';
import { getCurrentFamily } from './recipe-utils';
import { ReduxDispatch } from '../../core/types';
import { ROUTE } from '../../routes';

interface ReduxProps extends RouteComponentProps<any> {
    id: string;
    recipe: Recipe | null;
    families: RecipeFamily[];
}

export class RecipeEditBase extends React.Component<ReduxProps & ReduxDispatch<RootAction>, {}> {

    public render() {
        const { recipe, families } = this.props;
        if (recipe && families) {
            const { label, parts, recipeFamily, description } = recipe;
            return <div className="recipe-edit">
                <InputContainer label="Label">
                    <Input name="label" value={label} onChange={this.handleChange} />
                </InputContainer>
                <InputContainer label="Label">
                    <Select name="recipeFamily" value={recipeFamily} onChange={this.handleSelect} options={families} />
                </InputContainer>
                <InputContainer label="Description">
                    <Input name="description" value={description} onChange={this.handleChange} />
                </InputContainer>
                <div />
                {this.renderPumps(parts)}
                <Button onClick={this.handleRemove} type={ButtonType.DEFAULT}>DELETE</Button>
                <Button onClick={this.handleSubmit} type={ButtonType.ACTION}>SAVE</Button>
            </div>;
        }
        return null;
    }

    private renderPumps(parts: number[]) {
        const { families, recipe } = this.props;
        if (families && recipe) {
            const family = getCurrentFamily(families, recipe);
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
        const { recipe, dispatch } = this.props;
        const { target: { value, name } } = e;
        if (recipe) {
            dispatch(RootActions.SET_ATTRIBUTE({ id: name, value }))
        }
    }

    private handleRemove = () => {
        const { recipe } = this.props;
        const { dispatch } = this.props;
        if (recipe) {
            dispatch(RootActions.CMD_DELETE({ recipe }));
            browserHistory.push(ROUTE.root);
        }
    }

    private handleSubmit = () => {
        const { recipe, dispatch } = this.props;
        if (recipe) {
            dispatch(RootActions.CMD_EDIT({ recipe }));
            browserHistory.push(ROUTE.root);
        }
    }

    private handlePumpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        const { target: { value, name } } = e;
        dispatch(RootActions.SET_PART({ id: name, value }));
    }

    private handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { recipe, dispatch } = this.props;
        if (recipe) {
            const { target: { value, name } } = e;
            dispatch(RootActions.SET_ATTRIBUTE({ id: name, value }))
        }
    }
}

const mapStateToProps = (state: RootState) => {
    const {
        root: { recipe, families }
    } = state;
    return { recipe, families };
};

export const RecipeEdit = connect(mapStateToProps)(RecipeEditBase);
