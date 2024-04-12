import React, {useState, ReactNode, ChangeEvent, FormEvent} from 'react';
import {Button, Input} from "antd";
import {UserAddOutlined} from "@ant-design/icons";


const AddContactField = () => {

    const [inputValue, setInputValue] = useState<string>('');

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputValue.trim() !== '') {
            setInputValue('');
        }
    };
    return (
        <form onSubmit={handleSubmit} className="chat-input-form" style={{width: '100%'}}>
            <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Tyfsdyour message..."
                className="chat-input"
            />
            <Button className="send-button" style={{width: '5%', alignItems: 'center'}}>
                <UserAddOutlined style={{fontSize: '16px'}}/>
            </Button>
        </form>

    );
};

export default AddContactField;
