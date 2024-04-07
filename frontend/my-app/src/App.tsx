import React, {useEffect, useState} from 'react';
import './App.css';
import InputForm from './components/InputForm';
import {Avatar, List} from "antd";
import {UserItem} from "./Type/Type";
import VirtualList from 'rc-virtual-list';

function App() {
    /*Избавиться от копипасты, с помощью передачи в Message нужных props*/
    const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);

    const fakeDataUrl =
        'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
    const [data, setData] = useState<UserItem[]>([]);

    useEffect(() => {
        const handleResize = () => {
            setViewportHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        appendData();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
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
                // message.success(`${body.results.length} more items loaded!`);
            });
    };


    return (
        <div className="App">
            {/*Информация о чатах*/}
            <List style={{width: 'auto', flexDirection: 'row', minWidth: '40%'}}>
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
                                /*Здесь будет последнее сообщение*/
                                description={item.email}
                            />
                            <div>Content</div>
                        </List.Item>
                    )}
                </VirtualList>
            </List>

            <InputForm/>
        </div>
    );
}

export default App;


