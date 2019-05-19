import * as React from 'react';
import './recipe-item.less';
import { Recipe, RecipeIngredient } from '../../types';
import { Glass } from '../glass/glass';

export interface RecipeItemProps {
    recipe: Recipe;
    ingredients: RecipeIngredient[];
    onClick: (recipe: Recipe) => void;
}

export default class RecipeItem extends React.PureComponent<RecipeItemProps, any> {

    public render() {
        const { recipe: { label, parts, description }, ingredients } = this.props;
        return (
            <div className="recipe-item" onClick={this.handleClick}>
                <div className="recipe-item__title">{label}</div>
                <div className="recipe-item__glass"><Glass parts={parts} ingredients={ingredients} /></div>
                <div className="recipe-item__description">{description}</div>
            </div >
        );
    }

    private handleClick = () => {
        const { recipe, onClick } = this.props;
        onClick(recipe);
    }
}
