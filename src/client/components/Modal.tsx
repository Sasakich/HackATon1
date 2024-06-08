import React, { FC, useState, useEffect } from 'react';
import {
  $password,
  $userInput,
  buttonSubmit,
  passwordChange,
  setCurrentUser,
  userChange
} from "../models/init";
import { useUnit } from "effector-react";
import './Modal.css';

const CLIENT_ID = "2897c730c31dd10adb98";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose }) => {
  const [username, password] = useUnit([$userInput, $password]);
  const [rerender, setRerender] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state
  const [registerErrorMessage, setRegisterErrorMessage] = useState<string | null>(null); // Register error message state

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

  const getUserData = async (login: string, password: string) => {
    try {
      const response = await fetch(`http://localhost:3000/getUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: login, password: password })
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        }
        throw new Error('Network error occurred');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      setErrorMessage(error.message); // Set the error message
    }
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null); // Reset error message
    const user = await getUserData(username, password);
    if (user) {
      console.log(`User data:`, user);
      setCurrentUser({ username: user.login, userId: user.id });
      onClose();
    }
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
          throw new Error('Network error occurred');
        }
      }

      const data = await res.json();
      console.log(`Registration response:`, data);
      return data;
    } catch (error) {
      console.error('Error registering user:', error);
      setRegisterErrorMessage(error.message); // Set the registration error message
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setRegisterErrorMessage(null); // Reset register error message
    await registerUser(username, password);
    const user = await getUserData(username, password);
    if (user) {
      setCurrentUser({ username: user.login, userId: user.id });
      onClose();
    }
  };

  if (!isOpen) return null;

  const handleLogin = () => {
    window.location.href = "/auth/github";
  };

  return (
      <div className="overlay">
        <div className="container">
          <div className="backgroundText">KILOGRAM</div>
          <div className="modal">
            <p className="title">Please enter your details</p>
            {errorMessage && <p className="errorMessage">{errorMessage}</p>} {/* Display error message */}
            {registerErrorMessage && <p className="errorMessage">{registerErrorMessage}</p>} {/* Display register error message */}
            <form onSubmit={handleSignIn}>
              <label className="label">
                Username:
                <input type="text" value={username} onChange={handleUsernameChange} className="input" />
              </label>
              <label className="label">
                Password:
                <input type="password" value={password} onChange={handlePasswordChange} className="input" />
              </label>
              <div className="buttonContainer">
                <button type="submit" className="button">Sign in</button>
                <button type="button" className="button" onClick={handleRegister}>Register</button>
                <button type="button" className="button" onClick={handleLogin}>Sign in with GitHub</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default Modal;
