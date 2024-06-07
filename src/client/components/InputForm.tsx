import Message from "./Message/Message";
import { Message as M, SmallContact } from "../Type/Type";
import React, { useState, FormEvent, ChangeEvent, FC, useEffect } from 'react';
import './InputForm.css';
import { Input, Modal, Button, message, Upload, UploadProps, Avatar } from "antd";
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { socket } from "../models/socket";
import { $password, $userInput, currentChatUserStore } from "../models/init";
import { useUnit } from "effector-react";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Store } from "effector";

// Типы сообщений и пользователя
type ChatUser = {
    login: string;
    chatId: string;
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

const InputForm: FC = () => {
    const currentChatUser = useInit(currentChatUserStore);
    const [username, password] = useUnit([$userInput, $password]);
    const [inputValue, setInputValue] = useState<string>('');
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [messages, setMessages] = useState<M[]>([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:3000/getChat/${currentChatUser.chatId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                } else {
                    throw new Error('Failed to load messages');
                }
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        };

        if (currentChatUser?.chatId) {
            fetchMessages();
        }
    }, [currentChatUser]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputValue.trim() !== '') {
            const timestamp = new Date().toISOString();
            socket.emit('chat message', { chatId: currentChatUser.chatId, userId: username, createdAt: timestamp, updatedAt: timestamp, text: inputValue, name: "", image: "" });
            setInputValue('');
        }
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
        action: '/upload',  // путь к серверному маршруту для загрузки
        headers: {
            authorization: 'authorization-text',  // заголовок
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                console.log('Upload response:', info.file.response);  // логируем ответ сервера
                if (info.file.response && info.file.response.url) {  // сервер возвращает url
                    message.success(`${info.file.name} file uploaded successfully`);
                    const timestamp = new Date().toISOString();
                    socket.emit('chat message', { chatId: currentChatUser.chatId, userId: username, createdAt: timestamp, updatedAt: timestamp, text: "", name: "", image: info.file.response.url });
                } else {
                    message.error(`${info.file.name} file upload failed: No URL in response`);
                }
            } else if (info.file.status === 'error') {
                console.error('Upload error:', info.file.error);  // логируем ошибку
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                        size={64}
                        style={{
                            backgroundColor: avatarUrl ? 'transparent' : '#87d068',
                            marginBottom: 16,
                        }}
                        icon={!avatarUrl && <UserOutlined />}
                        src={avatarUrl || undefined}
                    />
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Change Avatar</Button>
                    </Upload>
                    <p><strong>Login:</strong> {currentChatUser?.login}</p>
                </div>
            </Modal>
        </div>
    );
}

export default InputForm;