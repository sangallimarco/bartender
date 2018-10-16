import * as React from 'react';
import './App.css';
// import { RoutePath } from './shared/route-path';
import { Router, Route, Switch } from 'react-router';
import { RecipeList } from './components/recipe/recipe-list';
import { browserHistory } from './core/browser-history';
import { RecipeEdit } from './components/recipe/recipe-edit';
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
              <Route path={ROUTE.edit} component={RecipeEdit} />
              <Route path={ROUTE.root} component={RecipeList} />
            </Switch>
          </Router>
        </div>
      </Provider>
    );
  }
}

export default App;
