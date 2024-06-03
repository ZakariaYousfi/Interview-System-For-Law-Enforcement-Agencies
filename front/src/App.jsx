import Audition from "./pages/Audition"
import { AdminInterface } from "./pages/admin";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";

const App = () =>  {
      return (
      <Routes>
            <Route exact path="/" element={<AuthPage/>} />
          <Route exact path="/home" element={<HomePage/>} />
          <Route path="/admin/*" element={<AdminInterface/>} />
          <Route path="/create-audition" element={<Audition/>} />
          <Route path="/open-audition" element={<Audition/>} />
      </Routes>
)

}

export default App