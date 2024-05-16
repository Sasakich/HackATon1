import React, {useEffect, useState} from 'react';
import './App.css';
import InputForm from './components/InputForm';
import {Avatar, List} from "antd";
import {UserItem, Message} from "./Type/Type";
import VirtualList from 'rc-virtual-list';
import Modal from './components/Modal';
import AddContactField from "./components/AddContactField";
import {io} from 'socket.io-client';
import {socket} from "./models/socket";
let init = false;
interface Contact {
    id: string;
    name: string;
}
function App() {

    const [messages, setMessages] = useState<Message[]>([]);
    const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);
    const [activeContact, setActiveContact] = useState<string>('');
    const [contacts, setContacts] = useState<Contact[]>([
        { id: "1", name: "Alice" },
        { id: "2", name: "Bob" },
        { id: "3", name: "Charlie" }
    ]);
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
    const [isModalOpen, setIsModalOpen] = useState(true); // Управление видимостью модального окна

    const handleClose = () => {
        setIsModalOpen(false); // Функция для закрытия модального окна
    };
    const handleAddContact = (name: string) => {
        console.log("ADDING CONTACT")
        const newContact = { id: `${Date.now()}`, name };
        setContacts(prevContacts => [...prevContacts, newContact]);
        setIsModalOpen(false); // Close the modal after adding
    };
    return (
        <div className="App">
            {}

            <List style={{width: 'auto', flexDirection: 'row', minWidth: '40%'}}>
                <List style={{ width: 'auto', flexDirection: 'row', minWidth: '40%' }}>
                    <AddContactField onAddContact={handleAddContact} />
                    {/* Список для отображения контактов */}
                    <List
                        itemLayout="horizontal"
                        dataSource={contacts}
                        renderItem={contact => (
                            <List.Item onClick={() => setActiveContact(contact.id)}>
                                <List.Item.Meta
                                    avatar={<Avatar>{contact.name.charAt(0)}</Avatar>}
                                    title={<a href="#">{contact.name}</a>}
                                />
                            </List.Item>
                        )}
                    />
                    <VirtualList
                        data={data}
                        height={viewportHeight - 52}
                        itemHeight={47}
                        itemKey="email"
                        onScroll={onScroll}
                    >
                        {(item: UserItem) => (
                            <List.Item key={item.email}>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.picture.large} />}
                                    title={<a href="https://ant.design">{item.name.last}</a>}
                                    description={item.email}
                                />
                                <div>Content</div>
                            </List.Item>
                        )}
                    </VirtualList>
                </List>
                <InputForm messages={messages} />
                <Modal isOpen={isModalOpen} onClose={handleClose} />
                <VirtualList
                    data={data}
                    height={viewportHeight - 52}
                    itemHeight={47}
                    itemKey="email"
                    onScroll={onScroll}
                >
                    {(item: UserItem) => (
                        <List.Item key={item.email}>
                            <List.Item.Meta
                                avatar={<Avatar src={item.picture.large}/>}
                                title={<a href="https://ant.design">{item.name.last}</a>}
                                description={item.email}
                            />
                            <div>Content</div>
                        </List.Item>
                    )}
                </VirtualList>
            </List>
            <InputForm messages={messages}/>
            <Modal isOpen={isModalOpen} onClose={handleClose}/>
                {}

            {}
        </div>
    );
}

export default App;


