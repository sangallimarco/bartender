import * as React from 'react';
import './recipe-list.css';
import RecipeItem from './recipe-item';
import Dialog from '../dialog/dialog';
import Processing from '../processing/processing';
import { browserHistory } from '../../core/browser-history';
import { Recipe, RecipeFamily, Actions } from '../../types';
import { getCurrentFamily } from './recipe-utils';
import { ROUTE } from '../../routes';
import { StateMachineInjectedProps, withStateMachine } from 'react-xstate-hoc';
import { RecipeListContext, RecipeListMachineEvent, RecipeListMachineState, RecipeListMachineStateSchema, RecipeListMachineAction, RecipeListStateMachine, RecipeListInitialContext } from './recipe-list-machine';
import { webSocketService } from 'src/core/websocket';

interface RecipeListBaseProps extends StateMachineInjectedProps<RecipeListContext, RecipeListMachineStateSchema, RecipeListMachineEvent> {
    initial?: boolean;
}

class RecipeListBase extends React.PureComponent<RecipeListBaseProps> {

    constructor(props: RecipeListBaseProps) {
        super(props);
        const { injectMachineOptions } = props;
        injectMachineOptions({});
    }

    public componentDidMount() {
        const { dispatch } = this.props;
        // enable edit mode
        document.addEventListener('keydown', this.handleKeyDown);
        // auto bind actions
        webSocketService.bindDispatcher(Actions, dispatch);
        dispatch({ type: RecipeListMachineAction.FETCH_RECIPES });
        dispatch({ type: RecipeListMachineAction.FETCH_FAMILIES });
    }

    public componentWillUnmount() {
        // enable edit mode
        document.removeEventListener('keydown', this.handleKeyDown);
        webSocketService.unbindAll();
    }

    public render() {
        const { context: { recipes, families, message }, currentState } = this.props;
        const dialogVisible = currentState === RecipeListMachineState.CONFIRMATION;
        const processing = currentState === RecipeListMachineState.PROCESSING;
        return (
            <div className="recipe__list">
                {this.renderItems(recipes, families)}
                <Dialog active={dialogVisible} onConfirm={this.handleConfirm} onDismiss={this.handleDismiss} message={message} />
                <Processing active={processing} />
            </div>
        );
    }

    public handleKeyDown = (e: KeyboardEvent) => {
        const { key } = e;
        const { context: { families }, dispatch } = this.props;
        switch (key) {
            case 'e':
                dispatch({ type: RecipeListMachineAction.SET_ADMIN });
                break;
            case 'n':
                dispatch({ type: RecipeListMachineAction.CREATE });
                browserHistory.push(ROUTE.edit, { families });
                break;
        }
    }

    private handleConfirm = () => {
        const { dispatch } = this.props;
        dispatch({ type: RecipeListMachineAction.MAKE });
    }

    private handleDismiss = () => {
        const { dispatch } = this.props;
        dispatch({ type: RecipeListMachineAction.CANCEL });
    }

    private handleSelected = (recipe: Recipe) => {
        const { context: { admin, families }, dispatch } = this.props;
        dispatch({ type: RecipeListMachineAction.SET_RECIPE, recipe });
        if (admin) {
            browserHistory.push(ROUTE.edit, { recipe, families });
        }
    }

    private renderItems(items: Recipe[], families: RecipeFamily[]) {
        return items.map((recipe: Recipe) => {
            const { id, recipeFamily } = recipe;
            const family = getCurrentFamily(families, recipeFamily);
            if (family) {
                const { ingredients } = family;
                return <RecipeItem key={id} recipe={recipe} ingredients={ingredients} onClick={this.handleSelected} />;
            }
            return null;
        })
    }
}

export const RecipeList = withStateMachine(RecipeListBase, RecipeListStateMachine, RecipeListInitialContext);