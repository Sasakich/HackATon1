// import React from "react";
// import "./Message.css";

// interface User {
//   name: string;
// }

// interface Message {
//   user: User;
//   message: string;
// }

// interface MessagesProps {
//   messages: Message[];
//   name: string;
// }

// const Chat: React.FC<MessagesProps> = ({ messages, name }) => {
//     console.log("Received name in Chat component:", name);
//     return (
//   <div className='messages'>
//     {messages.map(({ user, message }, i) => {
//       console.log("user.name:", user.name);
//       console.log("name:", name);

//       const itsMe = user.name === name;
//       console.log("itsMe:", itsMe);

//       const className = itsMe ? "me" : "user";
//       console.log("className:", className);

//       return (
//         <div key={i} className={`message ${className}`}>
//           <span className='user'>{user.name}</span>
//           <div className='text'>{message}</div>
//         </div>
//       );
//     })}
//   </div>
// );

//   };

// export default Chat;

import React, { useState, useEffect } from 'react';
import Withbd from '../withbd';
import "./Message.css";
import { $user } from "../../models/init"
import { $user2 } from "../../models/user2"
import {useUnit} from 'effector-react'

interface User {
  name: string;
}

interface Message {
  user: User;
  message: string;
}

interface MessagesProps {
  messages: Message[];
  name: string;
}

const Chat: React.FC<MessagesProps> = ({ messages }) => {
    const user = useUnit($user);
    const user2 = useUnit($user2);
    console.log("Received name in Chat component:", user?.name);
    const [loadedMessages, setLoadedMessages] = useState<Message[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const url = 'http://localhost:3001/api/messages';
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const responseData = await response.json();
                setLoadedMessages(responseData);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1>Chat Component</h1>
            <div className='messages'>
                {loadedMessages.map(({ user, message }, i) => {
                    console.log("user.name:", user?.name);
                    // console.log("name:", name);
                    const itsMe = user?.name === user2?.name;
                    console.log("itsMe:", itsMe);
                    const className = itsMe ? "me" : "user";
                    console.log("className:", className);
                    return (
                        <div key={i} className={`message ${className}`}>
                            <span className='user'>{user?.name}</span>
                            <div className='text'>{message}</div>
                        </div>
                    );
                })}
            </div>
            {/* Здесь добавляем компонент Withbd для загрузки данных */}
            <Withbd />
        </div>
    );
};

export default Chat;
