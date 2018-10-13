import * as React from 'react';
import './App.css';
// import { RoutePath } from './shared/route-path';
import { Router, Route, Switch } from 'react-router';
import { RecepyList } from './components/recepy/recepy-list';
import { browserHistory } from './core/browser-history';
import { RecepyEdit } from './components/recepy/recepy-edit';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { ROUTE } from './routes';

interface AppProps {
  store: Store;
}

class App extends React.Component<AppProps, {}> {

  public render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <div className="App">
          <Router history={browserHistory}>
            <Switch>
              <Route path={ROUTE.edit} component={RecepyEdit} />
              <Route path={ROUTE.root} component={RecepyList} />
            </Switch>
          </Router>
        </div>
      </Provider>
    );
  }
}

export default App;
