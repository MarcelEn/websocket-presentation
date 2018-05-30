import React, { Component } from 'react';
import MessageHandler from './MessageHandler';
import axios from 'axios';

class Benchmark extends Component {
    constructor(props) {
        super(props);
        this.state = {
            xhr: 0,
            ws: 0,
            start: new Date().valueOf()
        }
        this.xhrLoop = this.xhrLoop.bind(this);

        switch (props.type) {
            case "xhr":
                this.xhrLoop();
                break;
            case "ws":
                this.wsLoop();
                break;
            case "both":
                this.xhrLoop();
                this.wsLoop();
                break;
            default:
        }
    }

    wsLoop() {
        const that = this;
        const protocol = window.location.protocol === 'http:' ? 'ws:' : 'wss:';
        const socket = new WebSocket(`${protocol}//${window.location.host}/socketping`);

        socket.onopen = () => socket.send("ping");

        socket.onmessage = message => {
            that.setState({ ws: this.state.ws + 1 })
            socket.send("ping")
        }
    }

    xhrLoop() {
        const that = this;
        axios.get("/xhrping")
            .then(r => {
                that.setState({ xhr: this.state.xhr + 1 })
                that.xhrLoop(that);
            })
            .catch(e => { })
    }

    render() {
        const time = new Date().valueOf() - this.state.start
        return (
            <div>
                <h1>
                    Benchmark
                </h1>
                <table border="1px">
                    <thead>
                        <tr>
                            <td>
                                Method
                            </td>
                            <td>
                                Count
                            </td>
                            <td>
                                Time Per Ping
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                XHR:
                            </td>
                            <td>
                                {this.state.xhr}
                            </td>
                            <td>
                                {time / this.state.xhr}ms
                            </td>
                        </tr>
                        <tr>
                            <td>
                                WebSocket:
                            </td>
                            <td>
                                {this.state.ws}
                            </td>
                            <td>
                                {time / this.state.ws}ms
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Benchmark;
