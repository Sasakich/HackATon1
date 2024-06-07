import React, { useEffect, useState } from 'react';
import './App.css';
import InputForm from './components/InputForm';
import { Avatar, List, notification } from "antd";
import { UserItem, Message, SmallContact } from "./Type/Type";
import VirtualList from 'rc-virtual-list';
import Modal from './components/Modal';
import AddContactField from "./components/AddContactField";
import { io } from 'socket.io-client';
import { socket } from "./models/socket";
import { currentChatUserStore, setCurrentChatUser } from "./models/init";
import { useStore } from 'effector-react';
let init = false;
interface Contact {
    id: string;
    name: string;
}

function isAuth() {
  return Boolean(localStorage.getItem("accessToken"))
}
function App() {

    const [messages, setMessages] = useState<Message[]>([]);
    const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);
    const [activeContact, setActiveContact] = useState<string>('');
    const [activeDialog, setActiveDialog] = useState<{}>({});
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [api, contextHolder] = notification.useNotification();
    const fakeDataUrl =
        'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
    const [data, setData] = useState<UserItem[]>([]);

    // useEffect(() => {
    //     const handleResize = () => {
    //         setViewportHeight(window.innerHeight);
    //     };
    //     window.addEventListener('resize', handleResize);
    //     appendData();
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []);
    useEffect(() => {
        const handler = (message: Message) => {
            setMessages(m => [...m, message]);
            api.info({
                // message: `New message from ${name}`,
                message: `New message from 1`,
                description: '1',
                placement: 'bottomRight',
            });
            if (navigator.vibrate) {
                navigator.vibrate(200); // Вибрация на 200 миллисекунд
            }
        };
        socket.on('chat message', handler);
        return () => {
            socket.off('chat message', handler);
        };
    }, [api]);

    const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
        if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - viewportHeight + 52) <= 1) {
            appendData();
        }
    };

    const appendData = () => {
        fetch(fakeDataUrl)
            .then((res) => res.json())
            .then((body) => {
                setData(data.concat(body.results));
            });
    };
    const [isModalOpen, setIsModalOpen] = useState(!isAuth()); // Управление видимостью модального окна
    const getChatId = async () => {
        try {
            const response = await fetch("http://localhost:3000/createChat", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: '123',
                    userIds: [1, 2]
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            if (data.chatId) {
                console.log('Chat ID:', data.chatId);
                localStorage.setItem("chatId", data.chatId);
            }

            return data.chatId;
        } catch (error) {
            console.error('Error fetching chat ID:', error);
        }
    };
    const handleClose = () => {
        setIsModalOpen(false);
    };
    const handleAddContact = (name: string) => {
        console.log("ADDING CONTACT")
        const newContact = { id: `${Date.now()}`, name };
        setContacts(prevContacts => [...prevContacts, newContact]);
        setIsModalOpen(false);
    };
    currentChatUserStore.watch((state) => {
        console.log('Current chat user:', state);
    });
    return (
        <div className="App">
            {contextHolder}
            <List style={{width: 'auto', flexDirection: 'row', minWidth: '40%'}}>
                <List style={{ width: 'auto', flexDirection: 'row', minWidth: '40%' }}>
                    <AddContactField onAddContact={handleAddContact} />
                    <List
                        itemLayout="horizontal"
                        dataSource={contacts}
                        renderItem={contact => (
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <button onClick={() => getChatId().then(ans => setCurrentChatUser({login: contact.name, chatId: ans}))}>
                                    <List.Item.Meta
                                        avatar={<Avatar>{contact.name.charAt(0)}</Avatar>}
                                        title={contact.name}
                                    />
                                </button>
                            </div>

                        )}
                    />

                </List>
                <Modal isOpen={isModalOpen} onClose={handleClose} />
            </List>
            <div className={'chat-form'}>

                <InputForm messages={messages}/>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleClose}/>
            {}

            {}
        </div>
    );
}

export default App;


