import React, { FC, useState, useEffect } from 'react';
import {
  $password,
  $userInput,
  buttonSubmit,
  passwordChange,
  setCurrentChatUser,
  setCurrentUser,
  userChange
} from "../models/init";
import { useUnit } from "effector-react";

const CLIENT_ID = "2897c730c31dd10adb98";

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
      return response.json();
    }).then((data) => {
      if (data.access_token) {
        localStorage.setItem("accessToken", data.access_token);
        setRerender(!rerender);
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    if (codeParam && (localStorage.getItem("accessToken") === null)) {
      getAccessToken(codeParam);
    }
  }, [rerender]);

  function loginWithGithub() {
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID);
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    userChange(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    passwordChange(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    buttonSubmit();
    onClose();
  };

  const getUserData = async (login : string, password : string) => {
    try {
      const response = await fetch(`http://localhost:3000/getUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: login, password: password })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const aboba = async () => {
    console.log("Fetching user data...");
    const user = await getUserData(username, password);
    console.log(`User data:`, user);
    onClose()
    setCurrentUser({username: user.login, userId: user.id})
    return user;
  };

  const registerUser = async (username: string, password: string) => {
    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login: username, password: password })
      });

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error('User already exists');
        } else {
          throw new Error('Network response was not ok');
        }
      }

      const data = await res.json();
      console.log(`Registration response:`, data);
      return data;
    } catch (error) {
      console.error('Error registering user:', error);
      alert(error.message); // Inform the user
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    await registerUser(username, password);
    await aboba();
    onClose()
  };

  if (!isOpen) return null;

  return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ backgroundColor: '#fff', padding: 20 }}>
          <p>Пожалуйста, введите свои данные</p>
          <form onSubmit={handleSubmit}>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Имя пользователя:
              <input type="text" value={username} onChange={handleUsernameChange}
                     style={{ display: 'block', margin: '5px 0', width: 250 }} />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Пароль:
              <input type="password" value={password} onChange={handlePasswordChange}
                     style={{ display: 'block', margin: '5px 0', width: 250 }} />
            </label>
            <div style={{ backgroundColor: '#fff', padding: 20, display: "flex" }}>
              <button type="button" style={{ display: 'block', margin: '10px' }} onClick={aboba}>Войти</button>
              <button type="button" style={{ display: 'block', margin: '10px' }} onClick={loginWithGithub}>Войти с помощью
                gitHub
              </button>
              <button type="button" style={{ display: 'block', margin: '10px' }} onClick={handleRegister}>Зарегистрироваться
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Modal;