import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import './css/custom.css';
import './css/bootstrap.min.css';

import App from './app';
import registerServiceWorker from './registerServiceWorker';


//Nested Routes inherit the props from superclass
class Index extends Component {
    render() {
        return (
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<Index/>, document.getElementById('root'));
registerServiceWorker();

