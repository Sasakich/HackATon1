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
  const handleLogin = () => {
    window.location.href = "/auth/github";
  }
  return (
      <div style={styles.overlay}>
        <div style={styles.container}>
          <div style={styles.backgroundText}>KILOGRAM</div>
          <div style={styles.modal}>
            <p style={styles.title}>Please enter your details</p>
            <form onSubmit={handleSubmit}>
              <label style={styles.label}>
                User Name:
                <input type="text" value={username} onChange={handleUsernameChange} style={styles.input} />
              </label>
              <label style={styles.label}>
                Password:
                <input type="password" value={password} onChange={handlePasswordChange} style={styles.input} />
              </label>
              <div style={styles.buttonContainer}>
                <button type="submit" style={styles.button} onClick={aboba}>Sign in</button>
                <button type="submit" style={styles.button} onClick={handleRegister}>Register</button>
                <button type="button" style={styles.button} onClick={handleLogin}>Sign in with GitHub</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(#ADD8E6, 62%, pink)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
  },
  backgroundText: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '10rem',
    fontFamily: 'Bebas Neue, sans-serif',
    color: 'rgba(0, 0, 0, 0.1)',
    zIndex: 0,
    pointerEvents: 'none',
    letterSpacing: '1rem',
    '@media (max-width: 768px)': {
      fontSize: '5rem',
      letterSpacing: '0.5rem',
    },
  },
  modal: {
    position: 'relative',
    zIndex: 1,
    background: 'linear-gradient(pink, 28%, #ADD8E6)',
    padding: '1rem',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '400px',
    fontFamily: 'Bebas Neue, sans-serif',
    '@media (max-width: 768px)': {
      padding: '0.5rem',
    },
  },
  title: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
  },
  input: {
    display: 'block',
    margin: '5px 0',
    width: '100%',
    padding: '0.5rem',
    color: '#696969',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '5px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    background: '#696969',
    color: '#fff',
    cursor: 'pointer',
    fontFamily: 'Bebas Neue, sans-serif',
  },
};

export default Modal;