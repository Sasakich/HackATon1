import React, {useEffect, useState} from 'react';
import './App.css';
import InputForm from './components/InputForm';
import {Avatar, List} from "antd";
import {UserItem} from "./Type/Type";
import VirtualList from 'rc-virtual-list';
import Modal from './components/Modal';
import AddContactField from "./components/AddContactField";
import {io} from 'socket.io-client';
import {socket} from "./models/socket";
let init = false;

function App() {

    const [messages, setMessages] = useState<string[]>([]);
    const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);

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
        const handler = (message: string) => {
            setMessages(m => [...m, message])
        }
        socket.on('chat message', handler);
        return () => {
            socket.off('chat massage', handler);
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

    return (
        <div className="App">
            {}

            <List style={{width: 'auto', flexDirection: 'row', minWidth: '40%'}}>
                <AddContactField/>
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
            {/*<Modal isOpen={isModalOpen} onClose={handleClose}>*/}
            {/*    <p>Пожалуйста, введите свои данные</p>*/}
            {/*    {}*/}
            {/*</Modal>*/}
            {}
        </div>
    );
}

export default App;


