import React, {useState, FormEvent, ChangeEvent, FC, useEffect} from 'react';
import './InputForm.css';
import { Input} from "antd";
import {Button} from "antd";
import Message from "./Message/Message";
import {Message as M, SmallContact} from "../Type/Type";
import {socket} from "../models/socket";
import {$password, $user, $userInput, currentChatUserStore} from "../models/init";
import {useUnit} from "effector-react";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useStore } from 'effector-react';
import {Store} from "effector";
// import {Message} from "./Type/Type";



interface Message {
    text: string;
    sender: string;
    timestamp: string;
}
function useInit<T>(store : Store<T>) {
    const [state, setState] = useState(store.getState());
    useEffect(() => {
        const unsubscribe = store.watch(setState);
        return () => {
            unsubscribe();
        };
    }, [store]);

    return state;
}


const InputForm: FC<{messages: M[]}> = ({messages}) => {
    const currentChatUser = useInit(currentChatUserStore);
    const [username, password] = useUnit([$userInput, $password]);
    const [activeChatUser, setActiveChatUser] = useState<SmallContact>({login: 'start chatting'})
    //const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputValue.trim() !== '') {
            const timestamp = new Date().toISOString();  // Get the current time
            socket.emit('chat message', { "chatId": 1, "userId": username, "createdAt": timestamp, "updatedAt": timestamp, "text": inputValue, name: "", image: ""});// chatId, userId, createdAt, updatedAt, text
        }
        // if (inputValue.trim() !== '') {
        //     setMessages([...messages, {text: inputValue, sender: 'user'}]);
        //     setInputValue('');
        // }
        setInputValue('');
    };

    const handleEmojiButtonClick = () => {
        setShowEmojiPicker((prevState) => !prevState);
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setInputValue((prevValue) => prevValue + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    const handleMouseEnter = () => {
        setShowEmojiPicker(true);
    };

    const handleMouseLeave = () => {
        setShowEmojiPicker(false);
    };



    return (
        <div className="chat-container">
            <button className={'small-contact'}>
                {currentChatUser.login}
            </button>
            <Message messages={messages}/>
            <form onSubmit={handleSubmit} className="chat-input-form">
                <div className="input-with-emoji">
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        className="chat-input"
                    />
                    <Button
                        type="default"
                        onClick={handleEmojiButtonClick}
                        className="emoji-button"

                    >
                        😀
                    </Button>
                    {showEmojiPicker && (
                        <div className="emoji-picker-container" onMouseEnter={handleMouseEnter}
                             onMouseLeave={handleMouseLeave}>
                            <EmojiPicker onEmojiClick={handleEmojiClick}/>
                        </div>
                    )}
                </div>
                <Button htmlType={'submit'} className="send-button">
                    Send
                </Button>
            </form>
        </div>
    );
}

export default InputForm;
