import React, { FC, useState, useEffect } from 'react';
import { $password, $userInput, buttonSubmit, passwordChange, userChange } from "../models/init";
import { useUnit } from "effector-react";
import { gitUser } from "../../server";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose }) => {
    const [username, password] = useUnit([$userInput, $password]);
    const [rerender, setRerender] = useState(false);

    async function getAccessToken(codeParam: string) {
        await fetch("http://localhost:3000/getAccessToken?code=" + codeParam, {
            method: "GET"
        }).then((response) => {
            console.log(response);
            return response.json();
        }).then((data) => {
            console.log(data);
            if (data.access_token) {
                localStorage.setItem("accessToken", data.access_token);
                setRerender(!rerender);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParam = urlParams.get("code");
        console.log(codeParam);
        if (codeParam && (localStorage.getItem("accessToken") === null)) {
            getAccessToken(codeParam);
        }
    }, []);

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

    if (!isOpen) return null;

    const handleLogin = () => {
        window.location.href = "/auth/github";
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(#ADD8E6, 62%, pink)', // Градиентный фон в голубых тонах
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000 // Убедитесь, что он находится выше другого контента
        }}>
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '30%', // Положение по вертикали
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '20rem', // Увеличенный размер шрифта
                    fontFamily: 'Bebas Neue, sans-serif', // Использование нового шрифта
                    color: 'rgba(0, 0, 0, 0.1)', // Очень светлый цвет для текста
                    zIndex: 0,
                    pointerEvents: 'none',
                    letterSpacing: '2rem' // Увеличенное расстояние между буквами
                }}>
                    KILOGRAM
                </div>
                <div style={{
                    position: 'relative',
                    zIndex: 1,
                    background: 'linear-gradient(pink, 28%, #ADD8E6)', // Полупрозрачный белый фон
                    padding: 20,
                    borderRadius: 10,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    width: 300, // Ширина окна
                    fontFamily: 'Bebas Neue, sans-serif' // Применение шрифта ко всему содержимому
                }}>
                    <p style={{marginBottom: 20}}>Please enter your details</p>
                    <form onSubmit={handleSubmit}>
                        <label style={{display: 'block', marginBottom: '10px', }}>
                            User Name:
                            <input type="text" value={username} onChange={handleUsernameChange}
                                   style={{display: 'block', margin: '5px 0', width: '100%', padding: '5px', color: "#696969"}}/>
                        </label>
                        <label style={{display: 'block', marginBottom: '10px'}}>
                            Password:
                            <input type="password" value={password} onChange={handlePasswordChange}
                                   style={{display: 'block', margin: '5px 0', width: '100%', padding: '5px'}}/>
                        </label>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <button type="submit" style={{
                                padding: '10px 20px',
                                borderRadius: 5,
                                border: 'none',
                                background: '#696969',
                                color: '#fff',
                                cursor: 'pointer',
                                fontFamily: 'Bebas Neue, sans-serif' // Применение шрифта к кнопке
                            }}>Sign in
                            </button>
                            <button type="button" style={{
                                padding: '10px 20px',
                                borderRadius: 5,
                                border: 'none',
                                background: '#696969',
                                color: '#fff',
                                cursor: 'pointer',
                                fontFamily: 'Bebas Neue, sans-serif' // Применение шрифта к кнопке
                            }} onClick={handleLogin}>Sign in with GitHub
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Modal;
