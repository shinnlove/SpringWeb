import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FirstTry from './src/mobile/FirstTry';
import MyDetailPage from './src/mobile/MyDetailPage';

function App() {
    return (
        <div style={{margin: 20}}>

            <div style={{position:"relative"}}>
                {/*<img src="./images/logo.png" style={{display:"inline-block"}}/>*/}
                {/*<h1 style={{display:"inline-block", marginLeft:"20px", position:"absolute", top:"10px"}}>中国移动交流网站</h1>*/}
            </div>

            <hr/>
            <br/>
            <FirstTry/>
            {/*<MyDetailPage/>*/}

        </div>
    );
}

ReactDOM.render(<App/>, document.getElementById('root'));
