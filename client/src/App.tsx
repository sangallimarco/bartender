import * as React from 'react';
import './App.css';
import { RoutePath } from './shared/route-path';

// test only
import { webSocketService, WebSocketListener } from './core/websocket';

interface AppState {
  data: {},
  recepies: RecepyOption[]
};

interface RecepyOption {
  id: string;
  label: string;
}

class App extends React.Component<{}, AppState> {

  public state: AppState = {
    data: {},
    recepies: []
  }

  private listeners: WebSocketListener[] = [];

  public componentDidMount() {
    this.listeners.push(
      webSocketService.on(RoutePath.TEST, (data: {}) => {
        this.setState({ data });
      })
    );
    this.listeners.push(
      webSocketService.on(RoutePath.RECEPIES, (data) => {
        const recepies = data as RecepyOption[];
        this.setState({ recepies });
      })
    );

    webSocketService.send(RoutePath.RECEPIES, {});
  }

  public componentWillUnmount() {
    this.listeners.forEach((i) => i());
  }

  public render() {
    const { data, recepies } = this.state;
    return (
      <div className="App">
        TEST here {JSON.stringify(data)}
        recepies {JSON.stringify(recepies)}
        <button onClick={this.handleClick}>CLICK</button>
        <button onClick={this.handleClickLoad}>CLICK</button>
      </div>
    );
  }

  private handleClick = () => {
    webSocketService.send(RoutePath.TEST, { name: 'gintonic' });
  }

  private handleClickLoad = () => {
    webSocketService.send(RoutePath.RECEPIES, {});
  }
}

export default App;
