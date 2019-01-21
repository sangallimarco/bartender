import * as React from 'react';
import './recipe-list.css';
import RecipeItem from './recipe-item';
import Dialog from '../dialog/dialog';
import Processing from '../processing/processing';
import { browserHistory } from '../../core/browser-history';
import { Recipe, RecipeFamily } from '../../types';
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
        webSocketService.bindDispatcher(RecipeListMachineAction, dispatch);
        dispatch({ type: RecipeListMachineAction.CMD_RECIPES });
        dispatch({ type: RecipeListMachineAction.CMD_FAMILIES });
    }

    public componentWillUnmount() {
        // enable edit mode
        document.removeEventListener('keydown', this.handleKeyDown);
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
        const { dispatch } = this.props;
        switch (key) {
            case 'e':
                this.setState({ edit: true });
                break;
            case 'n':
                dispatch({ type: RecipeListMachineAction.CMD_NEW });
                browserHistory.push(ROUTE.edit);
                break;
        }
    }

    private handleConfirm = () => {
        const { dispatch } = this.props;
        dispatch({ type: RecipeListMachineAction.CMD_MAKE });
    }

    private handleDismiss = () => {
        const { dispatch } = this.props;
        dispatch({ type: RecipeListMachineAction.CANCEL });
    }

    private handleSelected = (recipe: Recipe) => {
        const { context: { admin }, dispatch } = this.props;
        dispatch({ type: RecipeListMachineAction.SET_RECIPE, recipe });
        if (admin) {
            browserHistory.push(ROUTE.edit);
        }
    }

    private renderItems(items: Recipe[], families: RecipeFamily[]) {
        return items.map((recipe: Recipe) => {
            const { id } = recipe;
            const family = getCurrentFamily(families, recipe);
            if (family) {
                const { ingredients } = family;
                return <RecipeItem key={id} recipe={recipe} ingredients={ingredients} onClick={this.handleSelected} />;
            }
            return null;
        })
    }
}

export const RecipeList = withStateMachine(RecipeListBase, RecipeListStateMachine, RecipeListInitialContext);