// import {Avatar, List, message} from "antd";
// import React, {useEffect, useState} from "react";
// import VirtualList from 'rc-virtual-list';
// import {UserItem} from "../../Type/Type";

// function Message() {

//     const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);

//     const fakeDataUrl =
//         'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
//     const [data, setData] = useState<UserItem[]>([]);

//     useEffect(() => {
//         const handleResize = () => {
//             setViewportHeight(window.innerHeight);
//         };
//         window.addEventListener('resize', handleResize);
//         appendData();
//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
//         if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - viewportHeight + 52) <= 1) {
//             appendData();
//         }
//     };

//     const appendData = () => {
//         fetch(fakeDataUrl)
//             .then((res) => res.json())
//             .then((body) => {
//                 setData(data.concat(body.results));
//                 // message.success(`${body.results.length} more items loaded!`);
//             });
//     };

//     return (
//         <List style={{width: '100%'}}>
//             <VirtualList
//                 data={data}
//                 height={viewportHeight - 52}
//                 itemHeight={47}
//                 itemKey="email"
//                 onScroll={onScroll}
//             >
//                 {(item: UserItem) => (
//                     <List.Item key={item.email}>
//                         <List.Item.Meta
//                             avatar={<Avatar src={item.picture.large} />}
//                             title={<a href="https://ant.design">{item.name.last}</a>}
//                             description={item.email}
//                         />
//                         <div>Content</div>
//                     </List.Item>
//                 )}
//             </VirtualList>
//         </List>
//     );
// }


// export default Message;

import React, { useEffect, useState } from "react";
import { Button, Input } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Chat from "./Chat";
import './Chat.css';

const socket = io("http://localhost:3001");

function Message() {
    const [params, setParams] = useState<{ room: string; user: string }>({ room: "", user: "" });
    const [state, setState] = useState<any[]>([]);
    const [message, setMessage] = useState<string>("");
    const [users, setUsers] = useState<number>(0);

    // const { search } = useLocation();
    // const navigate = useNavigate();

    // useEffect(() => {
    //     const searchParams = Object.fromEntries(new URLSearchParams(search));
    //     setParams(searchParams as { room: string; user: string });
    //     socket.emit("join", searchParams);
    // }, [search]);

    useEffect(() => {
        socket.on("message", ({ data }: { data: any }) => {
            setState(prevState => [...prevState, data]);
        });
    }, []);

    useEffect(() => {
        socket.on("room", ({ data: { users } }: { data: { users: any[] } }) => {
            setUsers(users.length);
        });
    }, []);

    function sendMessage(chatId : String, userId : String, text: String) {
        socket.emit('chat message', { chatId, userId, text });
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!message) return;

        sendMessage("1", "1", "Hello");

        setMessage("");
    };

    // const leftRoom = () => {
    //     socket.emit("leftRoom", { params });
    //     navigate("/");
    // };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    return (
        <div className='wrap'>
            <div className='header'>
                <div className='title'>{params.room}</div>
                <div className='users'>{users} users in this room</div>
            </div>
            {/*<Button className='left' onClick={leftRoom}>*/}
            {/*    Left the room*/}
            {/*</Button>*/}
            <div className='messages'>
                <Chat messages={state} name={params.user} />
            </div>

            <form className='form' onSubmit={handleSubmit}>
                <Input
                    type="text"
                    name="message"
                    placeholder="What do you want to say?"
                    value={message}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                />
                <Input type="submit" value="Send a message"/>
            </form>
        </div>
    );
};

export default Message;
