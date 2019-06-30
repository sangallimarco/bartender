import * as React from 'react';
import './processing.less';
import { CSSUtils } from '../../core/css-utils';

export interface ProcessingProps {
    active: boolean;
}

export default class Processing extends React.Component<ProcessingProps, any> {
    public render() {
        const { active } = this.props;
        const className = CSSUtils.parse('processing', {
            'processing--active': active
        });
        return (
            <div className={className}>
                <div className="processing__container">
                    animation here
                </div>
            </div>
        );
    }
}
