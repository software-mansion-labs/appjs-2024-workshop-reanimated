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
