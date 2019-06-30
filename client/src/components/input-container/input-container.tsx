import * as React from 'react';
import './input-container.less';

export interface InputContainerProps {
    label: string;
    children: JSX.Element
}

export default class InputContainer extends React.Component<InputContainerProps, {}> {
    public render() {
        const { children, label } = this.props;
        return (
            <div className="input-container">
                <label className="input-container__label">{label}</label>
                {children}
            </div>
        );
    }
}
