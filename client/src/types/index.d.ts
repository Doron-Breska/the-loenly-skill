export type UserType = 'regular' | 'premium' | 'admin';
export type Sex = 'Male' | 'Female' | 'Non-Binary' | 'Transgender' | 'Intersex' | 'Prefer Not to Say' | 'Other';

export interface Skill {
  _id: string;
  owner: string; // User ID
  category: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface Feedback {
  _id: string; 
  fromUser: string; 
  quote: string;
}

export interface Message {
  _id: string;
  sender: string;
  content: string;
  chat: string;  // represent Schema.Types.ObjectId of a chat 
  seen: boolean
  createdAt?: string;
  updatedAt?: string;
}

export interface Participant {
  _id: string;
  username: string;
}

export interface Chat {
  _id: string;
  participants: Participant[];
  chatType?: string; // "one-to-one", "group",
  messages?: Message[];
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  img: any;
  _id: string;
  bio: string;
  blockedUsers: string[];
  userType: UserType;
  email: string;
  verified: boolean;
  latitude: number;
  longitude: number;
  username: string;
  reportCounter: number;
  age: number;
  userImg: string[]; 
  skills: Skill[];
  sex: Sex;
  feedback: Feedback[];
  chats: Chat[];
  hasMet: string[]; 
  createdAt?: string;
  updatedAt?: string;
}


type Avatar = string | File;


export interface NewUser {
  username: string;
  email: string;
  password: string;
  bio: string;
  age: number;
  sex: string;
  userImg: Avatar;
  latitude: number;
  longitude: number;
}