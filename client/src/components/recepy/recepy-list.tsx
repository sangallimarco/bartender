import * as React from 'react';
import './recepy.css';
import RecepyItem from './recepy-item';
import Dialog from '../dialog/dialog';
import Processing from '../processing/processing';
import { browserHistory } from '../../core/browser-history';
import { RootState, RootActions, RootAction } from '../../stores';
import { Dispatch, bindActionCreators, } from 'redux';
import { connect } from 'react-redux';
import { Recepy, MakePayload } from '../../shared';

interface RecepyListBaseProps {
    recepies: Recepy[];
    processing: boolean;
    getAll: () => any;
    make: (payload: MakePayload) => any;
}

interface RecepyListBaseState {
    edit: boolean;
    dialogVisible: boolean;
    message: string;
    recepy: Recepy | null;
}

class RecepyListBase extends React.Component<RecepyListBaseProps, RecepyListBaseState> {

    public state = {
        dialogVisible: false,
        edit: false,
        message: '',
        recepy: null
    };

    public componentDidMount() {
        const { getAll } = this.props;
        getAll();

        // enable edit mode
        document.addEventListener('keydown', this.handleKeyDown);
    }

    public render() {
        const { recepies, processing } = this.props;
        const { dialogVisible, message } = this.state;
        return (
            <div className="recepy-list">
                {this.renderItems(recepies)}
                <Dialog active={dialogVisible} onConfirm={this.handleConfirm} onDismiss={this.handleDismiss} message={message} />
                <Processing active={processing} />
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
        const { make } = this.props;
        const { recepy } = this.state;
        if (recepy) {
            const { id } = recepy as Recepy;
            make({ id });
            this.setState({ dialogVisible: false });
        }
    }

    private handleDismiss = () => {
        this.setState({ dialogVisible: false });
    }

    private handleSelected = (recepy: Recepy) => {
        const { edit } = this.state;
        const { id, label } = recepy;
        this.setState({ recepy });
        if (edit) {
            browserHistory.push(`/edit/${id}`); // refactor this without ID
        } else {
            const message = `Confirm ${label}?`;
            this.setState({ dialogVisible: true, message });
        }
    }

    private renderItems(items: Recepy[]) {
        return items.map((recepy: Recepy) => {
            const { id } = recepy;
            return <RecepyItem key={id} recepy={recepy} onClick={this.handleSelected} />;
        })
    }
}

const mapStateToProps = (state: RootState) => {
    const {
        root: { processing, recepies }
    } = state;
    return { processing, recepies };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => bindActionCreators({
    getAll: RootActions.CMD_RECEPIES,
    make: RootActions.CMD_MAKE
}, dispatch);

export const RecepyList = connect(mapStateToProps, mapDispatchToProps)(RecepyListBase);