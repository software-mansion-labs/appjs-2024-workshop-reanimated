import { layout } from "./theme";

export const tabsList = [
  "Animation",
  "Branding",
  "Illustration",
  "Calligraphy",
  "Doodling",
  "Game development",
  "Drawing",
  "Development",
];

export const alphabet = "abcdefghijklmnopqrstuvwxyz";

const randomAvatar = () => {
  const num = Math.floor(Math.random() * 60);
  return `https://i.pravatar.cc/${layout.avatarSize}?img=${num}`;
};

export type Contact = {
  name: string;
  avatar: string;
};
export type ContactSection = {
  title: string;
  index: number;
  key: string;
  data: Contact[];
};

export const contacts: ContactSection[] = [
  ...Array(alphabet.length).keys(),
].map((sectionIndex) => {
  const letter = alphabet.charAt(sectionIndex).toUpperCase();
  return {
    title: letter,
    index: sectionIndex,
    key: `list-${letter}`,
    data: [...Array(Math.floor(Math.random() * 7) + 5).keys()].map((i) => ({
      name: `${letter}-Contact ${i + 1}`,
      avatar: randomAvatar(),
    })),
  };
});

export const friends = [
  "https://pbs.twimg.com/profile_images/1276570366555684865/7J55FrYi_400x400.jpg",
  "https://pbs.twimg.com/profile_images/1064786289311010816/zD2FlyxR_400x400.jpg",
];

export type Post = {
  id: number;
  thumbnailUri: string;
  originalUri: string;
};

export const images: Post[] = [...Array(30).keys()].map((index) => {
  const _baseUri = `https://picsum.photos/id/${index + 10}`;
  return {
    id: index + 1,
    thumbnailUri: `${_baseUri}/200/200?grayscale`,
    originalUri: `${_baseUri}/500/500`,
  };
});

export interface MessageType {
  id: string;
  message: string;
  from: "me" | "them";
}

export const messages: MessageType[] = [
  {
    id: "77c3b675-d205-4045-ab0d-f8ddc8034d2f",
    message: "yo! wanna grab some beer tonight? 🍺",
    from: "them",
  },
  {
    id: "538947ab-e13a-44a7-a7e7-3173eef4f3e3",
    message: "there's a new cool pub with open taps just down the street",
    from: "them",
  },
  {
    id: "34c5cf25-28f8-44b8-b0a6-6f1122a4930e",
    message: "yeah sure what time?",
    from: "me",
  },
  {
    id: "4e7ff5fa-3f1e-4f24-9c74-0888d61b87bb",
    message: "around 8pm?",
    from: "them",
  },
  {
    id: "64979e03-d826-45b7-8537-0b7ff4145c69",
    message: "does that work for you?",
    from: "them",
  },
  {
    id: "0ef80176-8a2d-4768-91dd-fc972449af8d",
    message: "could we do a little bit earlier? like 7pm?",
    from: "me",
  },
  {
    id: "f0b76422-f7e9-4d92-8a8b-4d051affb358",
    message: "yea sounds good 👍",
    from: "them",
  },
  {
    id: "ce95c873-e221-4353-9c8c-533184519d02",
    message: "should I bring my +1?",
    from: "me",
  },
  {
    id: "909a2f38-0c2a-4da7-a8ba-939ef7f54eda",
    message: "yup, take Natalie with you!",
    from: "them",
  },
  {
    id: "de58f781-88c2-48df-9298-4f389aa70559",
    message: "ok, see you there! 👋",
    from: "me",
  },
  {
    id: "bdc64d98-3c60-4ae7-be57-4b8ea91a858f",
    message: "cya!",
    from: "them",
  },
];

export const items = [...Array(12).keys()].map((index) => {
  return {
    key: `item-${index}`,
    label: `Item ${index}`,
  };
});
