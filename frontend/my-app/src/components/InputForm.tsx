
// InputForm.tsx
import React, { useState, FormEvent } from 'react';
import { Input, Button } from "antd";
import React, {useState, FormEvent, ChangeEvent, FC} from 'react';
import './InputForm.css';
import { Input} from "antd";
import {Button} from "antd";
import Message from "./Message/Message";
import {Message as M} from "../Type/Type";
import {socket} from "../models/socket";
import {$password, $user, $userInput} from "../models/init";
import {useUnit} from "effector-react"

// import {Message} from "./Type/Type";

interface InputFormProps {
    onSendMessage: (text: string) => void;
}



const InputForm: FC<{messages: M[]}> = ({messages}) => {
    const [username, password] = useUnit([$userInput, $password]);
    
    //const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState<string>('');

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (inputValue.trim() !== '') {
            socket.emit('chat message', {"text": inputValue, "userId": username})
        }
        // if (inputValue.trim() !== '') {
        //     setMessages([...messages, {text: inputValue, sender: 'user'}]);
        //     setInputValue('');
        // }
        setInputValue('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Type your message here..."
            />
            <Button type="primary" htmlType="submit">Send</Button>
        </form>
    );
}

export default InputForm;
