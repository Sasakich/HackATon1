import {Avatar, List, message} from "antd";
import React, {FC, useEffect, useState} from "react";
import VirtualList from 'rc-virtual-list';
import {UserItem} from "../../Type/Type";

const Message: FC<{messages: string[]}> = ({messages}) => {
    console.log(messages);

    const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);

    const fakeDataUrl =
        'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
    const [data, setData] = useState<UserItem[]>([]);

    useEffect(() => {
        const handleResize = () => {
            setViewportHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
       // appendData();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
        if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - viewportHeight + 52) <= 1) {
           // appendData();
        }
    };

    // const appendData = () => {
    //     fetch(fakeDataUrl)
    //         .then((res) => res.json())
    //         .then((body) => {
    //             setData(data.concat(body.results));
    //             // message.success(`${body.results.length} more items loaded!`);
    //         });
    // };

    return (
        <List style={{width: '100%'}}>
            <VirtualList
                data={messages}
                height={viewportHeight - 52}
                itemHeight={47}
                itemKey="email"
                onScroll={onScroll}
            >
                {(item: string) => (
                    <List.Item key={item}>
                        <List.Item.Meta
                            // avatar={<Avatar src={item.picture.large} />}
                            // title={<a href="https://ant.design">{item.name.last}</a>}
                            description={item}
                        />
                        <div>Content</div>
                    </List.Item>
                )}
            </VirtualList>
        </List>
    );
}


export default Message;