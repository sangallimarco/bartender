import * as React from 'react';
import './recepy-item.css';
import { Recepy } from '../../types';
import { Glass } from '../glass/glass';

export interface RecepyItemProps {
    recepy: Recepy;
    onClick: (recepy: Recepy) => void;
}

export default class RecepyItem extends React.PureComponent<RecepyItemProps, any> {

    public render() {
        const { recepy: { label, parts } } = this.props;
        return (
            <div className="recepy__item" onClick={this.handleClick}>
                <div className="recepy__item__title">{label}</div>
                <div className="recepy__item__glass"><Glass parts={parts} /></div>
            </div >
        );
    }

    private handleClick = () => {
        const { recepy, onClick } = this.props;
        onClick(recepy);
    }
}
