import { List } from "antd";
import React, { FC, useEffect, useState } from "react";
import VirtualList from 'rc-virtual-list';

const Message: FC<{ messages: string[] }> = ({ messages }) => {
    const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setViewportHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
        if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - viewportHeight + 52) <= 1) {
            // Здесь может быть логика для подгрузки новых данных, если это требуется
        }
    };

    return (
        <List style={{ width: '100%' }}>
            <VirtualList
                data={messages}
                height={viewportHeight - 52} // Вычитаем высоту, если есть какие-то элементы интерфейса сверху или снизу
                itemHeight={47} // Высота одного элемента списка
                itemKey={(item: string) => item} // Используем сообщение как ключ
                onScroll={onScroll}
            >
                {(item: string) => (
                    <List.Item key={item}>
                        <List.Item.Meta
                            description={item}
                        />
                        <div>это я</div>
                    </List.Item>
                )}
            </VirtualList>
        </List>
    );
}

export default Message;
