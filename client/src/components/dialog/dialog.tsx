import * as React from 'react';
import './dialog.css';
import Button, { ButtonType } from '../button/button';
import { CSSUtils } from '../../core/css-utils';

export interface DialogProps {
    active: boolean;
    message: string;
    onConfirm: () => void;
    onDismiss: () => void;
}

export default class Dialog extends React.Component<DialogProps, any> {
    public render() {
        const { active, onConfirm, onDismiss, message } = this.props;
        const className = CSSUtils.parse('dialog', {
            'dialog-active': active
        });
        return (
            <div className={className}>
                <div className="dialog__container">
                    <div className="dialog__message">{message}</div>
                    <div className="dialog__confirm"><Button type={ButtonType.ACTION} onClick={onConfirm}>CONFIRM</Button></div>
                    <div className="dialog__dismiss"><Button type={ButtonType.DEFAULT} onClick={onDismiss}>CANCEL</Button></div>
                </div>
            </div>
        );
    }
}
