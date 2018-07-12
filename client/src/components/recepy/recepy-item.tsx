import * as React from 'react';
import './recepy-item.css';

export interface RecepyItemProps {
    label: string;
    id: string;
    onClick: (id: string, label: string) => void;
}

export default class RecepyItem extends React.PureComponent<RecepyItemProps, any> {

    public render() {
        const { label } = this.props;
        return (
            <div className="recepy__item" onClick={this.handleClick}>
                {label}
            </div>
        );
    }

    private handleClick = () => {
        const { onClick, id, label } = this.props;
        onClick(id, label);
    }
}
