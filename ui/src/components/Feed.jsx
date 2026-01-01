import Post from "./Post";

const posts = [
  {
    username: "imran",
    userAvatar: "/avatar.jpg",
    image: "/photo1.jpg",
    caption: "My first post!",
    likes: 12,
    comments: ["Nice!", "🔥🔥"]
  },
   {
    username: "imran",
    userAvatar: "/avatar.jpg",
    image: "/photo1.jpg",
    caption: "My first post!",
    likes: 12,
    comments: ["Nice!", "🔥🔥"]
  },
   {
    username: "imran",
    userAvatar: "/avatar.jpg",
    image: "/photo1.jpg",
    caption: "My first post!",
    likes: 12,
    comments: ["Nice!", "🔥🔥"]
  },
   {
    username: "imran",
    userAvatar: "/avatar.jpg",
    image: "/photo1.jpg",
    caption: "My first post!",
    likes: 12,
    comments: ["Nice!", "🔥🔥"]
  }
];

const Feed = () => {
  return (
    <>
      {posts.map((p, i) => (
        <Post key={i} post={p} />
      ))}
    </>
  );
};

export default Feed;
