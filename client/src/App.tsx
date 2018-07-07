import * as React from 'react';
import './App.css';
import { RoutePath } from './shared/route-path';

// test only
import { webSocketService } from './core/websocket';

interface AppState {
  data: {}
};

class App extends React.Component<{}, AppState> {

  public state: AppState = {
    data: {}
  }

  public componentDidMount() {
    webSocketService.on(RoutePath.TEST, (data: {}) => {
      this.setState({ data });
    });
  }

  public render() {
    const { data } = this.state;
    return (
      <div className="App">
        TEST here {JSON.stringify(data)}
        <button onClick={this.handleClick}>CLICK</button>
      </div>
    );
  }

  private handleClick = () => {
    webSocketService.send(RoutePath.TEST, {});
  }
}

export default App;
