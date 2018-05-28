import React from 'react';

const MESSAGE_BOX_STYLE = {
    border: "1px solid black",
    overflowY: "auto",
    height: "200px"
}
const MessageHandler = props => (
    <div>
        <div style={MESSAGE_BOX_STYLE}>
            {
                props.messages.map((message, key) => (
                    <div key={key}>
                        {message}
                        <hr />
                    </div>
                ))
            }
        </div>
        <input type="text"
            onChange={props.handleChange}
            value={props.text}
        />
        <button onClick={props.handleSubmit}>
            send
        </button>
    </div>
)

export default MessageHandler;
