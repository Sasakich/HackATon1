import {Avatar, List, message} from "antd";
import React, {useEffect, useState} from "react";
import VirtualList from 'rc-virtual-list';

interface UserItem {
    email: string;
    gender: string;
    name: {
        first: string;
        last: string;
        title: string;
    };
    nat: string;
    picture: {
        large: string;
        medium: string;
        thumbnail: string;
    };
}

function Message() {

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
        <List style={{width: '100%'}}>
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
    );
}


export default Message;