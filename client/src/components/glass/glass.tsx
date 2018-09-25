import * as React from 'react';
// import { RecepyIngredient } from '../../types';
import { buildGlass } from '../../core/glass-builder';
import './glass.css';


export interface GlassProps {
    // ingredients: RecepyIngredient[];
    parts: number[];
}

export class Glass extends React.Component<GlassProps, {}>{

    public render() {
        return <svg className="glass" ref={this.saveRef} />
    }

    private saveRef = (ref: SVGSVGElement) => {
        const { parts } = this.props;
        buildGlass(parts, ['#ff00ff', '#FFFF00', '#FAFAFA', '#0000FF', '#00FF00'], ref)
    }
}