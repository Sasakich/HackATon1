// InputForm.tsx
import React, { useState, FormEvent } from 'react';
import { Input, Button } from "antd";

interface InputFormProps {
    onSendMessage: (text: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSendMessage }) => {
    const [inputValue, setInputValue] = useState<string>('');

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Type your message here..."
            />
            <Button type="primary" htmlType="submit">Send</Button>
        </form>
    );
}

export default InputForm;
