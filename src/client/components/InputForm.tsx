import Message from "./Message/Message";
import { Message as M, SmallContact } from "../Type/Type";
import React, { useState, FormEvent, ChangeEvent, FC, useEffect } from 'react';
import './InputForm.css';
import { Input, Modal, Button, message, Upload, UploadProps } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { socket } from "../models/socket";
import { $password, $userInput, currentChatUserStore } from "../models/init";
import { useUnit } from "effector-react";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Store } from "effector";

// Типы сообщений и пользователя
type ChatUser = {
    login: string;
};

interface Message {
    text: string;
    sender: string;
    timestamp: string;
}

// Кастомный хук для подписки на стор и обновления компонента
function useInit<T>(store: Store<T>): T {
    const [state, setState] = useState(store.getState());
    useEffect(() => {
        const unsubscribe = store.watch(setState);
        return () => {
            unsubscribe();
        };
    }, [store]);

    return state;
}

const InputForm: FC<{ messages: M[] }> = ({ messages }) => {
    const currentChatUser = useInit(currentChatUserStore);
    const [username, password] = useUnit([$userInput, $password]);
    const [activeChatUser, setActiveChatUser] = useState<SmallContact>({ login: 'start chatting' });
    const [inputValue, setInputValue] = useState<string>('');
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputValue.trim() !== '') {
            const timestamp = new Date().toISOString();
            socket.emit('chat message', { chatId: 1, userId: username, createdAt: timestamp, updatedAt: timestamp, text: inputValue, name: "", image: "" });
        }
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

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const uploadProps: UploadProps = {
        name: 'file',
        action: '/upload',  // путь к вашему серверному маршруту для загрузки
        headers: {
            authorization: 'authorization-text',  // убедитесь, что этот заголовок правильный
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                console.log('Upload response:', info.file.response);
                if (info.file.response && info.file.response.url) {
                    message.success(`${info.file.name} file uploaded successfully`);
                    const timestamp = new Date().toISOString();
                    socket.emit('chat message', { chatId: 1, userId: username, createdAt: timestamp, updatedAt: timestamp, text: "", name: "", image: info.file.response.url });
                } else {
                    message.error(`${info.file.name} file upload failed: No URL in response`);
                }
            } else if (info.file.status === 'error') {
                console.error('Upload error:', info.file.error);
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <div className="chat-container">
            <button className='small-contact' onClick={openModal}>
                {currentChatUser?.login ?? 'No User'}
            </button>
            <Message messages={messages} />
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
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                </div>
                <Button htmlType='submit' className="send-button">
                    Send
                </Button>
                <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />} className="upload-button">Upload Image</Button>
                </Upload>
            </form>
            <Modal
                title="User Profile"
                visible={modalIsOpen}
                onCancel={closeModal}
                footer={null}
                closable={true}
                closeIcon={<span style={{ fontSize: '1.5em' }}>✖</span>}
            >
                <div>
                    <p><strong>Login:</strong> {currentChatUser?.login}</p>
                </div>
            </Modal>
        </div>
    );
}

export default InputForm;