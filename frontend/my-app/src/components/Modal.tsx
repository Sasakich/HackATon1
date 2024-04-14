import React, { FC, useState, ReactNode } from 'react';
import {$password, $user, $userInput, buttonSubmit, passwordChange, userChange} from "../models/init";
import {useUnit} from "effector-react"

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;

}

const Modal: FC<ModalProps> = ({ isOpen, onClose }) => {
    const [username, password] = useUnit([$userInput, $password]);



    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        userChange(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        passwordChange(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        buttonSubmit();
        console.log("done1");

            // const response = await fetch(url, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ login: username, password: password }),
            // });
            //
            // console.log("gotten resp");
            // if (!response.ok) {
            //     throw new Error('Network response was not ok');
            // }



            onClose();
        console.log("done");
    };
    if (!isOpen )return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{backgroundColor: '#fff', padding: 20}}>
                <p>Пожалуйста, введите свои данные</p>
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
