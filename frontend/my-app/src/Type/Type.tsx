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
    text: string;
    userId: string;
    timestamp: string;
}