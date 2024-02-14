import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  About,
  Dashboard,
  Home,
  Projects,
  SignIn,
  SignUp,
  CreatePost,
  UpdatePost,
  PostPage
} from "./pages/index";
import { Header, FooterComp, PrivateRoute, OnlyAdminPrivateRoute,ScrollToTop } from "./components/index";

// routing
function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost/>} />
        </Route>
        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:postSlug" element={<PostPage/>} />
      </Routes>
      <FooterComp />
    </BrowserRouter>
  );
}

export default App;
