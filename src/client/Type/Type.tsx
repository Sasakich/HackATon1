export interface UserItem {
    email: string;
    gender: string;
    name: {
        first: string;
        last: string;
        title: string;
    };
    nat: string;
    picture: {
        large: string;
        medium: string;
        thumbnail: string;
    };
}

export interface MessageData {
    text: string;
    sender: string;
}
export interface Message {
    message: string;
    userId: string;
    createdAt: string;
}
export interface SmallContact{
    login: string | null,
    chatId: number | null,
    userId: number | null
}
export interface CurrentUser{
    username: string,
    userId : number
}
