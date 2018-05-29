import React, { Component } from 'react';
import MessageHandler from './MessageHandler';
import axios from 'axios';

class SSE extends Component {
    constructor(props) {
        super(props);

        const eventSource = new EventSource(`${window.location.origin}/sse`);
        eventSource.addEventListener("init", e => { this.init(JSON.parse(e.data)) })
        eventSource.addEventListener("add_message", e => { this.addMessage(JSON.parse(e.data)) })
        eventSource.addEventListener("error", e => { this.init([]) })

        this.state = {
            messages: [],
            text: "",
            eventSource
        }
        this.init = this.init.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeSocket = this.closeSocket.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }
    init(initMessages) {
        this.setState({ messages: initMessages })
    }
    addMessage(message) {
        this.setState({ messages: [...this.state.messages, message] })
    }

    handleSubmit() {
        axios.post("/post", {text: this.state.text})
        this.setState({ text: "" });
    }

    closeSocket(){
        this.state.eventSource.close();
    }
    handleChange(proxy) {
        this.setState({ text: proxy.target.value })
    }
    render() {
        return (
            <div>
                <h1>SSE</h1>
                <button onClick={this.closeSocket}>
                    close Socket
                </button>
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

export default SSE;
