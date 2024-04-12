import React, { useState, ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const url = 'http://localhost:3000/api/users';
        console.log("done1");
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login: username, password: password }),
            });

            console.log("gotten resp");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);
            onClose();
        } catch (error) {
            console.error('Error:', error);
        }
        console.log("done");
    };
    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#fff', padding: 20 }}>
                <form onSubmit={handleSubmit}>
                    <label style={{display: 'block', marginBottom: '10px'}}>
                        Имя пользователя:
                        <input type="text" value={username} onChange={handleUsernameChange}
                               style={{display: 'block', margin: '5px 0', width: 250}}/>
                    </label>
                    <label style={{display: 'block', marginBottom: '10px'}}>
                        Пароль:
                        <input type="password" value={password} onChange={handlePasswordChange}
                               style={{display: 'block', margin: '5px 0', width: 250}}/>
                    </label>
                    <div style={{backgroundColor: '#fff', padding: 20, display: "flex"}}>
                        <button type="submit" style={{display: 'block', margin: '10px'}}>Войти</button>
                        <button type="submit" style={{display: 'block', margin: '10px'}}>Войти с помощью gitHub</button>
                    </div>
                </form>
            </div>
        </div>
);
};

export default Modal;
