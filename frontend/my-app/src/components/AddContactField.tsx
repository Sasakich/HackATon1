import React, { useState, ChangeEvent, FormEvent } from 'react';
import { UserAddOutlined } from "@ant-design/icons";
import {Button, Input} from "antd";

interface AddContactFieldProps {
    onAddContact: (name: string) => void;
}

const AddContactField: React.FC<AddContactFieldProps> = ({ onAddContact }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const formRef = React.createRef<HTMLFormElement>();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        console.log("TRYING TO ADD CONATCT")
        event.preventDefault(); 
        if (inputValue.trim() !== '') {
            onAddContact(inputValue); 
            console.log(inputValue)
            setInputValue(''); 
        }
    };

    const handleClick = () => {
        formRef.current?.submit(); 
    };

    return (
        <form onSubmit={handleSubmit} className="chat-input-form" style={{ width: '100%' }}>
            <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type your contact name..."
                className="chat-input"
            />
            <Button  htmlType={'submit'} className="send-button">
                <UserAddOutlined style={{ fontSize: '16px' }} />
            </Button>
        </form>
    );
};

export default AddContactField;
