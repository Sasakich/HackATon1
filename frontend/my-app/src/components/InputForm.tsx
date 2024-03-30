import React, { useState, FormEvent, ChangeEvent } from 'react';
import './InputForm.css';
import { Input } from "antd";
import { Button } from "antd";

interface Message {
  text: string;
  sender: string;
}

function InputForm() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim() !== '') {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      setInputValue('');
    }
  };
  return (
    <div className="chat-container">
      {/* <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div> */}
      <form onSubmit={handleSubmit} className="chat-input-form">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="chat-input"
        />
        <Button className="send-button">
          Send
        </Button>
      </form>
    </div>
  );
}

export default InputForm;