import * as React from 'react';
import './recipe-list.css';
import RecipeItem from './recipe-item';
import Dialog from '../dialog/dialog';
import Processing from '../processing/processing';
import { browserHistory } from '../../core/browser-history';
import { RootState } from '../../stores';
import { connect } from 'react-redux';
import { Recipe, RootActions, RootAction, RecipeFamily } from '../../types';
// import { Dispatch } from 'redux';
import { ReduxDispatch } from '../../core/types';
import { getCurrentFamily } from './recipe-utils';
import { ROUTE } from '../../routes';

interface ReduxProps {
    recipes: Recipe[];
    recipe: Recipe | null;
    processing: boolean;
    families: RecipeFamily[];
}

interface RecipeListBaseState {
    edit: boolean;
    dialogVisible: boolean;
    message: string;
}

class RecipeListBase extends React.Component<ReduxProps & ReduxDispatch<RootAction>, RecipeListBaseState> {

    public state = {
        dialogVisible: false,
        edit: false,
        message: ''
    };

    public componentDidMount() {
        // enable edit mode
        document.addEventListener('keydown', this.handleKeyDown);
    }

    public componentWillUnmount() {
        // enable edit mode
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    public render() {
        const { recipes, processing, families } = this.props;
        const { dialogVisible, message } = this.state;
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
                dispatch(RootActions.CMD_NEW());
                browserHistory.push(ROUTE.edit);
                break;
        }
    }

    private handleConfirm = () => {
        const { dispatch, recipe } = this.props;
        if (recipe) {
            dispatch(RootActions.CMD_MAKE({ recipe }));
        }
        this.setState({ dialogVisible: false });
    }

    private handleDismiss = () => {
        this.setState({ dialogVisible: false });
    }

    private handleSelected = (recipe: Recipe) => {
        const { dispatch } = this.props;
        const { edit } = this.state;
        const { label } = recipe;
        dispatch(RootActions.SET_RECEPY(recipe));
        if (edit) {
            browserHistory.push(ROUTE.edit);
        } else {
            const message = `Confirm ${label}?`;
            this.setState({ dialogVisible: true, message });
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

const mapStateToProps = (state: RootState): ReduxProps => {
    const {
        root: { processing, recipes, recipe, families }
    } = state;
    return { processing, recipes, recipe, families };
};

export const RecipeList = connect(mapStateToProps)(RecipeListBase);
