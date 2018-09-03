import * as React from 'react';
import './recepy-item.css';
import { Recepy } from '../../stores/types';

export interface RecepyItemProps {
    recepy: Recepy;
    onClick: (recepy: Recepy) => void;
}

export default class RecepyItem extends React.PureComponent<RecepyItemProps, any> {

    public render() {
        const { recepy: { label } } = this.props;
        return (
            <div className="recepy__item" onClick={this.handleClick}>
                {label}
            </div>
        );
    }

    private handleClick = () => {
        const { recepy, onClick } = this.props;
        onClick(recepy);
    }
}
