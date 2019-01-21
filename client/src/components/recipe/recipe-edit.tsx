import * as React from 'react';
import { PumpPin, Recipe } from '../../types';
import Button, { ButtonType } from '../button/button';
import { Input } from '../input/input';
import './recipe-edit.css';
import { browserHistory } from '../../core/browser-history';
import { Select } from '../select/select';
import InputContainer from '../input-container/input-container';
import { getCurrentFamily } from './recipe-utils';
import { ROUTE } from '../../routes';
import { withStateMachine, StateMachineInjectedProps } from 'react-xstate-hoc';
import { RecipeContext, RecipeMachineStateSchema, RecipeMachineEvent, RecipeInitialContext, RecipeStateMachine, RecipeMachineAction } from './recipe-machine';
// import { RouteComponentProps } from 'react-router';

interface RecipeEditBaseProps extends StateMachineInjectedProps<RecipeContext, RecipeMachineStateSchema, RecipeMachineEvent> {
    recipe: Recipe;
}

export class RecipeEditBase extends React.PureComponent<RecipeEditBaseProps> {

    public render() {
        const { context: { recipe, families } } = this.props;
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
        const { context: { families, recipe } } = this.props;
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
        const { target: { value, name: id } } = e;
        if (recipe) {
            dispatch({ type: RecipeMachineAction.SET_ATTRIBUTE, id, value })
        }
    }

    private handleRemove = () => {
        const { context: { recipe: { id } } } = this.props;
        const { dispatch } = this.props;
        if (id) {
            dispatch({ type: RecipeMachineAction.CMD_DELETE, id });
            browserHistory.push(ROUTE.root);
        }
    }

    private handleSubmit = () => {
        const { recipe, dispatch } = this.props;
        if (recipe) {
            dispatch({ type: RecipeMachineAction.CMD_EDIT, recipe });
            browserHistory.push(ROUTE.root);
        }
    }

    private handlePumpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        const { target: { value, name } } = e;
        dispatch({ type: RecipeMachineAction.SET_PART, id: name, value });
    }

    private handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { recipe, dispatch } = this.props;
        if (recipe) {
            const { target: { value, name: id } } = e;
            dispatch({ type: RecipeMachineAction.SET_ATTRIBUTE, id, value })
        }
    }
}

export const RecipeEdit = withStateMachine(RecipeEditBase, RecipeStateMachine, RecipeInitialContext);