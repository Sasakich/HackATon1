// AddContactField.tsx
import React, { useState } from 'react';
import { Input, Button } from "antd";

interface AddContactFieldProps {
    onAddContact: (name: string) => void;
}

const AddContactField: React.FC<AddContactFieldProps> = ({ onAddContact }) => {
    const [inputValue, setInputValue] = useState<string>('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (inputValue.trim()) {
            onAddContact(inputValue);
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Enter contact name..."
            />
            <Button type="primary" htmlType="submit">Add</Button>
        </form>
    );
}

export default AddContactField;
