import React, {useEffect, useState} from 'react';
import './App.css';
import InputForm from './components/InputForm';
import {Avatar, List} from "antd";
import {UserItem, Message, SmallContact} from "./Type/Type";
import VirtualList from 'rc-virtual-list';
import Modal from './components/Modal';
import AddContactField from "./components/AddContactField";
import {io} from 'socket.io-client';
import {socket} from "./models/socket";
import {currentChatUserStore, setCurrentChatUser} from "./models/init";
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
            setMessages(m => [...m, message])
        }
        socket.on('chat message', handler);
        return () => {
            socket.off('chat message', handler);
        }
    }, []);

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

            <List style={{width: 'auto', flexDirection: 'row', minWidth: '40%'}}>
                <List style={{ width: 'auto', flexDirection: 'row', minWidth: '40%' }}>
                    <AddContactField onAddContact={handleAddContact} />
                    <List
                        itemLayout="horizontal"
                        dataSource={contacts}
                        renderItem={contact => (
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <button onClick={() => setCurrentChatUser({login: contact.name})}>
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


