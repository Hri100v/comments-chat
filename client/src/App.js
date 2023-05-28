import { Route, Routes } from "react-router-dom";
import { PostList } from "./components/PostLists";
import "./styles.css";
import { PostProvider } from "./contexts/PostContext";
import { Post } from "./components/Post";

function App() {
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
    </div>
  );

  // return <PostList />;
}

export default App;
