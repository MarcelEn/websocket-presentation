import React, { Component } from 'react';
import MessageHandler from './MessageHandler';
import axios from 'axios';

class HttpRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            text: ""
        }

        this.getMessagesLoop = this.getMessagesLoop.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getMessagesLoop() {
        const that = this;
        axios.get("/messages?q=" + that.state.messages.length)
            .then(response => {
                that.setState({ messages: [...that.state.messages, ...response.data] })
                that.getMessagesLoop();
            })
            .catch(e => { 
                if (!e.response) that.getMessagesLoop() 
            });
    }

    handleSubmit() {
        axios.post("/post", { text: this.state.text })
        this.setState({ text: "" });
    }

    handleChange(proxy) {
        this.setState({ text: proxy.target.value })
    }
    componentDidMount() {
        this.getMessagesLoop();
    }
    render() {
        return (
            <div>
                <h1>XMLHttpRequest</h1>
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

export default HttpRequest;
