import React, {useState, FormEvent, ChangeEvent, FC} from 'react';
import './InputForm.css';
import { Input} from "antd";
import {Button} from "antd";
import Message from "./Message/Message";
import {socket} from "../models/socket";


interface Message {
    text: string;
    sender: string;
}



const InputForm: FC<{messages: string[]}> = ({messages}) => {
    //const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState<string>('');

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputValue.trim() !== '') {
            socket.emit('chat message', inputValue)
        }
        // if (inputValue.trim() !== '') {
        //     setMessages([...messages, {text: inputValue, sender: 'user'}]);
        //     setInputValue('');
        // }
    };



    return (
        <div className="chat-container">

            <Message messages={messages}/>
            <form onSubmit={handleSubmit} className="chat-input-form" >
                <Input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="chat-input"
                />
                <Button htmlType={'submit'} className="send-button">
                    Send
                </Button>
            </form>
        </div>
    );
}

export default InputForm;