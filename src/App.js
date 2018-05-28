import React, { Component } from 'react';
import HttpRequest from './HttpRequest';
import Websocket from './Websocket';

const WEBSOCKET = "WEBSOCKET";
const HTTP_REQUEST = "HTTP_REQUEST";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: null
        }
    }
    render() {
        switch (this.state.mode) {
            case WEBSOCKET:
                return (<Websocket />);
            case HTTP_REQUEST:
                return (<HttpRequest />);
            default:
                return (
                    <div>
                        <button onClick={() => this.setState({ mode: WEBSOCKET })}>
                            Websocket
                        </button>
                        <button onClick={() => this.setState({ mode: HTTP_REQUEST })}>
                            HttpRequest
                        </button>
                    </div>
                )
        }
    }
}

export default App;
