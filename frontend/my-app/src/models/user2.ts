import {combine, createEffect, createEvent, createStore, restore, sample} from 'effector';

interface User {
    id: number;
    name: string;
    surname: string;
}

interface Login {
    user2: string;
}


export const postUser = async (login: Login) => {
    const res = await fetch(
        `http://localhost:3001/api/chatsToUsers/login/${login.user2}/${$user2}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(login),
        }
    );
    return res.json();
}

export const userChange = createEvent<string>();

export const $userInput = restore(userChange,'');
export const $user2 = createStore<User | null>(null);

export const getUsersFx = createEffect<Login, User>(
    postUser
);

export const buttonAdd = createEvent();

sample({
    clock: buttonAdd,
    source: $userInput,
    fn: (user2) => ({user2}),
    target: getUsersFx,
    filter: () => !getUsersFx.pending,
})
sample({
    clock: getUsersFx.doneData,
    target: $user2
})