import * as React from 'react';
import { CSSUtils } from '../../core/css-utils';
import './button.less';

export enum ButtonType {
    DEFAULT = 'default',
    ACTION = 'action'
}

export interface ButtonProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children: string;
    type: ButtonType;
}

export default class Button extends React.Component<ButtonProps, any> {
    public render() {
        const { type, children, onClick } = this.props;
        const className = CSSUtils.parse('button', `button--${type}`)
        return (
            <button className={className} onClick={onClick}>
                {children}
            </button>
        );
    }
}
