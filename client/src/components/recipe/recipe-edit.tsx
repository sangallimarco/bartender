import * as React from 'react';
import { PumpPin, Recipe, RecipeFamily } from '../../types';
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
import { RouteComponentProps } from 'react-router';

interface RecipeRouterProps {
    recipe: Recipe;
    families: RecipeFamily[];
}

type RecipeEditBaseProps = StateMachineInjectedProps<RecipeContext, RecipeMachineStateSchema, RecipeMachineEvent> & RouteComponentProps<RecipeRouterProps>;

export class RecipeEditBase extends React.PureComponent<RecipeEditBaseProps> {

    private families: RecipeFamily[] = [];

    constructor(props: RecipeEditBaseProps) {
        super(props);
        const { injectMachineOptions } = props;
        injectMachineOptions({
            actions: {
                [RecipeMachineAction.SAVE]: (ctx) => console.log(ctx)
            }
        });
    }

    public componentDidMount() {
        const { history: { location: { state: { recipe, families } } }, dispatch } = this.props;
        this.families = families;
        dispatch({ type: RecipeMachineAction.HYDRATE, recipe });
    }

    public render() {
        const { context: { id, label, recipeFamily, description, parts } } = this.props;
        const families = this.families;
        if (id && families) {
            return <div className="recipe-edit">
                <InputContainer label="Label">
                    <Input name="label" value={label} onChange={this.handleLabelChange} />
                </InputContainer>
                <InputContainer label="Label">
                    <Select name="recipeFamily" value={recipeFamily} onChange={this.handleSelect} options={families} />
                </InputContainer>
                <InputContainer label="Description">
                    <Input name="description" value={description} onChange={this.handleDescriptionChange} />
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
        const { context: { recipeFamily } } = this.props;
        const families = this.families;
        if (families && recipeFamily) {
            const family = getCurrentFamily(families, recipeFamily);
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

    private handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        const { target: { value: label } } = e;
        dispatch({ type: RecipeMachineAction.SET_LABEL, label });
    }

    private handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        const { target: { value: description } } = e;
        dispatch({ type: RecipeMachineAction.SET_DESCRIPTION, description });
    }

    private handleRemove = () => {
        const { dispatch } = this.props;
        dispatch({ type: RecipeMachineAction.DELETE });
        browserHistory.push(ROUTE.root);
    }

    private handleSubmit = () => {
        const { dispatch } = this.props;
        dispatch({ type: RecipeMachineAction.SAVE });
        browserHistory.push(ROUTE.root);
    }

    private handlePumpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        const { target: { value, name } } = e;
        dispatch({ type: RecipeMachineAction.SET_PART, id: name, value });
    }

    private handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { dispatch } = this.props;
        const { target: { value: recipeFamily } } = e;
        dispatch({ type: RecipeMachineAction.SET_FAMILY, recipeFamily })
    }
}

export const RecipeEdit = withStateMachine(RecipeEditBase, RecipeStateMachine, RecipeInitialContext);