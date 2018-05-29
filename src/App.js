import React, { Component } from 'react';
import HttpRequest from './HttpRequest';
import Websocket from './Websocket';
import SSE from './SSE';

const WEBSOCKET = "WEBSOCKET";
const HTTP_REQUEST = "HTTP_REQUEST";
const USE_SSE = "USE_SSE";

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
            case USE_SSE:
                return (<SSE />);
            default:
                return (
                    <div>
                        <button onClick={() => this.setState({ mode: WEBSOCKET })}>
                            Websocket
                        </button>
                        <button onClick={() => this.setState({ mode: HTTP_REQUEST })}>
                            XMLHttpRequest
                        </button>
                        <button onClick={() => this.setState({ mode: USE_SSE })}>
                            SSE
                        </button>
                    </div>
                )
        }
    }
}

export default App;
