import * as React from 'react';
import { buildGlass } from '../../core/glass-builder';
import './glass.less';
import { RecipeIngredient } from '../../types';
import { getIngredientColors } from '../recipe/recipe-utils';


export interface GlassProps {
    ingredients: RecipeIngredient[];
    parts: number[];
}

export class Glass extends React.Component<GlassProps, {}>{

    public render() {
        return <svg className="glass" ref={this.saveRef} />
    }

    private saveRef = (ref: SVGSVGElement) => {
        const { parts, ingredients } = this.props;
        const colors = getIngredientColors(ingredients);
        buildGlass(parts, colors, ref)
    }
}