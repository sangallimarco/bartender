import * as React from 'react';
import './App.less';
import { Router, Route, Switch } from 'react-router';
import { RecipeList } from './components/recipe/recipe-list';
import { browserHistory } from './core/browser-history';
import { RecipeEdit } from './components/recipe/recipe-edit';
import { ROUTE } from './routes';


class App extends React.Component<{}, {}> {

  public render() {
    return (
      <div className="App">
        <Router history={browserHistory}>
          <Switch>
            <Route path={ROUTE.edit} component={RecipeEdit} />
            <Route path={ROUTE.root} component={RecipeList} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
