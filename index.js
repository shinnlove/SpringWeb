import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Redirect, useRouterHistory} from 'react-router';
import {createHashHistory} from 'history';

const appHistory = useRouterHistory(createHashHistory)({queryKey: false});
import './index.css';
import FirstTry from './src/mobile/FirstTry';
import MyDetailPage from './src/mobile/MyDetailPage';
import HelloOne from './src/mobile/HelloOne';
import HelloTwo from './src/mobile/HelloTwo';
import DynamicFieldSet from './src/module/DynamicFieldSet';
import DynamicView from './src/mobile/DynamicView';

function App() {
    return (
        <div style={{margin: 20}}>

            <Router history={appHistory}>

                <Redirect from="/dataview" to="/dataview/AnalysisPlateform/Survey"/>
                <Redirect from="/platform/Grail" to="/Grail"/>
                <Redirect from="/" to="/dynamic/view"/>

                <Route path="/">
                    <Route path="webdata">
                        <Route path="list" name="list" component={FirstTry}/>
                        <Route path="detail/:id" name="detail" component={MyDetailPage}/>
                    </Route>
                    <Route path="reportNew">
                        <Route path="helloOnePage" name="helloOnePage" component={HelloOne}/>
                        <Route path="helloTwoPage" name="helloTwoPage" component={HelloTwo}/>
                    </Route>
                    <Route path="dynamic">
                        <Route path="fieldSet" name="fieldSet" component={DynamicFieldSet}/>
                        <Route path="view" name="view" component={DynamicView}></Route>
                    </Route>
                </Route>

                <Redirect from="*" to="/"/>

            </Router>

        </div>
    );
}

ReactDOM.render(<App/>, document.getElementById('root'));
