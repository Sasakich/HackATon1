import React, { useState } from 'react';
import './App.css';
import InputForm from './components/InputForm';
import MessageDisplay from './components/MessageDisplay';
import AddContactField from "./components/AddContactField";
import { Button, List, Modal } from "antd";

interface Contact {
    id: string;
    name: string;
}

interface MessageData {
    text: string;
    sender: string;
}

interface MessagesByContact {
    [contactId: string]: MessageData[];
}

function App() {
    const [contacts, setContacts] = useState<Contact[]>([
        { id: "1", name: "Alice" },
        { id: "2", name: "Bob" },
        { id: "3", name: "Charlie" }
    ]);
    const [activeContact, setActiveContact] = useState<string>('');
    const [messages, setMessages] = useState<MessagesByContact>({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSendMessage = (text: string) => {
        const newMessage: MessageData = { text, sender: 'You' };
        const updatedMessages = {
            ...messages,
            [activeContact]: [...(messages[activeContact] || []), newMessage]
        };
        setMessages(updatedMessages);
    };

    const selectContact = (contactId: string) => {
        setActiveContact(contactId);
    };

    const handleAddContact = (name: string) => {
        const newContact = { id: `${Date.now()}`, name };
        setContacts(prevContacts => [...prevContacts, newContact]);
        setIsModalOpen(false); // Close the modal after adding
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="App">
            <Button onClick={openModal} type="primary" style={{ marginBottom: 16 }}>
                Add New Contact
            </Button>
            <Modal title="Add New Contact" visible={isModalOpen} onCancel={closeModal} footer={null}>
                <AddContactField onAddContact={handleAddContact} />
            </Modal>
            <List>
                {contacts.map(contact => (
                    <List.Item key={contact.id} onClick={() => selectContact(contact.id)}>
                        <Button>{contact.name}</Button>
                    </List.Item>
                ))}
            </List>
            <div className="chat-area">
                {activeContact && (
                    <>
                        <MessageDisplay messages={messages[activeContact] || []} />
                        <InputForm onSendMessage={handleSendMessage} />
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
