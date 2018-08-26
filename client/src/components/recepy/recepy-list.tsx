import * as React from 'react';
import './recepy.css';
import RecepyItem from './recepy-item';
import Dialog from '../dialog/dialog';
import Processing from '../processing/processing';
// import { browserHistory } from '../../core/browser-history';
import { RootState, RootActions, RootAction } from '../../stores';
import { Dispatch, bindActionCreators, } from 'redux';
import { connect } from 'react-redux';
import { Recepy } from '../../shared';

interface RecepyListBaseProps {
    recepies: Recepy[];
    getAll: () => any;
}

class RecepyListBase extends React.Component<RecepyListBaseProps, {}> {

    public componentDidMount() {
        const { getAll } = this.props;
        getAll();

        // enable edit mode
        document.addEventListener('keydown', this.handleKeyDown);
    }

    public render() {
        const { recepies } = this.props;
        return (
            <div className="recepy-list">
                {this.renderItems(recepies)}
                <Dialog active={false} onConfirm={this.handleConfirm} onDismiss={this.handleDismiss} message={'okook'} />
                <Processing active={false} />
            </div>
        );
    }

    public handleKeyDown = (e: KeyboardEvent) => {
        const { key } = e;
        switch (key) {
            case 'e':
                this.setState({ edit: true });
                break;
            // case 'n':
            //     webSocketService.send<{}>(NEW, {});
            //     break;
        }
    }

    private handleConfirm = () => {
        // const { id } = this.state;
        // webSocketService.send<MakePayload>(MAKE, { id });
        this.setState({ dialogVisible: false });
    }

    private handleDismiss = () => {
        this.setState({ dialogVisible: false });
    }

    private handleSelected = (id: string, label: string) => {
        // const { edit } = this.state;
        // if (edit) {
        //     browserHistory.push(`/edit/${id}`);
        // } else {
        //     const message = `Confirm ${label}?`;
        //     this.setState({ id, dialogVisible: true, message });
        // }
    }

    private renderItems(items: Recepy[]) {
        return items.map((i: Recepy) => {
            const { label, id } = i;
            return <RecepyItem key={id} label={label} id={id} onClick={this.handleSelected} />;
        })
    }
}

const mapStateToProps = (state: RootState) => ({
    recepies: state.root.recepies,
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => bindActionCreators({
    getAll: RootActions.CMD_RECEPIES,
}, dispatch);

export const RecepyList = connect(mapStateToProps, mapDispatchToProps)(RecepyListBase);