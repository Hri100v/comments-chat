import { Route, Routes } from "react-router-dom";
import { PostList } from "./components/PostLists";
import "./styles.css";
import { PostProvider } from "./contexts/PostContext";
import { Post } from "./components/Post";
import { useState } from "react";

function Button() {
  let val = 0;

  return <button>Value Count: {val}</button>;
}

function App() {
  const [count, setCount] = useState(0);

  // let count = 0;

  const adjustCount = (amount) => {
    console.log(amount);
    // count = count + amount;
    setCount(count + amount);
  }

  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:id" element={
          <PostProvider>
            <Post />
          </PostProvider>
        } />
      </Routes>
      <button onClick={() => adjustCount(2)}>Count: {count}</button>
      <Button />
    </div>
  );

  // return <PostList />;
}

export default App;

// edit
