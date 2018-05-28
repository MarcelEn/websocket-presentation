import React, { Component } from 'react';
import MessageHandler from './MessageHandler';


class Websocket extends Component {
    constructor(props) {
        super(props);

        const protocol = window.location.protocol === 'http:' ? 'ws:' : 'wss:';

        const socket = new WebSocket(`${protocol}//${window.location.host}/socket`);

        socket.onopen = () => console.log("connected");

        socket.onmessage = message => this.handleIncomingMessage(message);


        this.state = {
            messages: [],
            text: "",
            socket
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleIncomingMessage = this.handleIncomingMessage.bind(this);
    }

    handleSubmit() {
        this.state.socket.send(this.state.text);
        this.setState({ text: "" });
    }

    handleChange(proxy) {
        this.setState({ text: proxy.target.value })
    }

    handleIncomingMessage(message) {
        const data = JSON.parse(message.data);
        const type = data[0];
        const payload = data[1];

        switch (type) {
            case 'init':
                this.setState({ messages: payload })
                break;
            case 'add_message':
                this.setState({ messages: [...this.state.messages, payload] })
                break;
            default:
        }
    }

    render() {
        return (
            <div>
                <h1>Websocket</h1>
                <MessageHandler
                    messages={this.state.messages}
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    text={this.state.text}
                />
            </div>
        )
    }
}

export default Websocket;
