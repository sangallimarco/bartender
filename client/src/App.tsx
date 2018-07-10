import * as React from 'react';
import './App.css';
// import { RoutePath } from './shared/route-path';
import { Router, Route } from 'react-router';
import { RecepyList } from './features/recepy/recepy-list';
import createBrowserHistory from 'history/createBrowserHistory';

const customHistory = createBrowserHistory()

interface AppState {
  data: {},
  recepies: RecepyOption[]
};

interface RecepyOption {
  id: string;
  label: string;
}

class App extends React.Component<{}, AppState> {

  public render() {
    return (
      <div className="App">
        <Router history={customHistory}>
          <Route path="/" component={RecepyList} />
        </Router>
      </div>
    );
  }
}

export default App;
