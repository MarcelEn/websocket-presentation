import React, { Component } from 'react';
import HttpRequest from './HttpRequest';
import Websocket from './Websocket';
import SSE from './SSE';
import Benchmark from './Benchmark';

const WEBSOCKET = "WEBSOCKET";
const HTTP_REQUEST = "HTTP_REQUEST";
const USE_SSE = "USE_SSE";
const BENCHMARK  = "BENCHMARK";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: null,
            type: null
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
                case BENCHMARK:
                return (<Benchmark type={this.state.type}/>)
            default:
                return (
                    <div>
                        <h2>
                            Chat:
                        </h2>
                        <button onClick={() => this.setState({ mode: HTTP_REQUEST })}>
                            XMLHttpRequest
                        </button>
                        <button onClick={() => this.setState({ mode: USE_SSE })}>
                            SSE
                        </button>
                        <button onClick={() => this.setState({ mode: WEBSOCKET })}>
                            WebSocket
                        </button>
                        <h2>
                            Benchmark:
                        </h2>
                        <button onClick={() => this.setState({mode: BENCHMARK, type: "xhr"})}>
                            xhr
                        </button>
                        <button onClick={() => this.setState({mode: BENCHMARK, type: "ws"})}>
                            WebSocket
                        </button>
                        <button onClick={() => this.setState({mode: BENCHMARK, type: "both"})}>
                            both
                        </button>
                        
                    </div>
                )
        }
    }
}

export default App;
