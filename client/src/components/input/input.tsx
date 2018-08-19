import * as React from 'react';
import { CSSUtils } from '../../core/css-utils';
import './input.css';

export interface InputProps {
    disabled?: boolean;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    key?: number | string;
    value?: string;
    autoFocus?: boolean;
    placeholder?: string;
}

export interface InputState {
    value: string;
}

export class Input extends React.Component<InputProps, InputState> {
    public state: InputState = {
        value: ''
    };

    public componentDidMount() {
        const { value = '' } = this.props;
        this.setState({ value });
    }

    public componentDidUpdate(prevProps: InputProps, prevState: InputState) {
        const { value: prevValue } = prevProps;
        const { value } = this.props;
        if (value !== undefined && prevValue !== value) {
            this.setState({ value });
        }
    }

    public render() {
        const { disabled, autoFocus, placeholder, name } = this.props;
        const { value } = this.state;
        const className = CSSUtils.parse('input', 'input-component');
        return (
            <input
                type="text"
                name={name}
                className={className}
                disabled={disabled}
                onChange={this.handleChange}
                value={value}
                autoFocus={autoFocus}
                placeholder={placeholder}
            />
        );
    }

    private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { onChange } = this.props;
        const { target: { value } } = e;
        if (value !== undefined) {
            this.setState({ value });
        }
        e.stopPropagation();
        onChange(e);
    };
}
