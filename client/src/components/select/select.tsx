import * as React from 'react';
import { CSSUtils } from '../../core/css-utils';
import './select.css';

export interface SelectProps {
    disabled?: boolean;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    key?: number | string;
    value?: string;
    autoFocus?: boolean;
    placeholder?: string;
    options: SelectOption[];
}

interface SelectOption {
    id: string;
    label: string;
}

export interface SelectState {
    value: string;
}

export class Select extends React.Component<SelectProps, SelectState> {
    public state: SelectState = {
        value: ''
    };

    public componentDidMount() {
        const { value = '' } = this.props;
        this.setState({ value });
    }

    public componentDidUpdate(prevProps: SelectProps, prevState: SelectState) {
        const { value: prevValue } = prevProps;
        const { value } = this.props;
        if (value !== undefined && prevValue !== value) {
            this.setState({ value });
        }
    }

    public render() {
        const { disabled, autoFocus, placeholder, name, options } = this.props;
        const { value } = this.state;
        const className = CSSUtils.parse('select', 'select-component');
        return (
            <select
                name={name}
                className={className}
                disabled={disabled}
                onChange={this.handleChange}
                value={value}
                autoFocus={autoFocus}
                placeholder={placeholder}
            >
                {this.renderOptions(options)}
            </select>
        );
    }

    private renderOptions(options: SelectOption[]) {
        return options.map((o: SelectOption) => {
            return <option key={o.id} value={o.id} label={o.label} />;
        });
    }

    private handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { onChange } = this.props;
        const { target: { value } } = e;
        if (value !== undefined) {
            this.setState({ value });
        }
        e.stopPropagation();
        onChange(e);
    };
}
