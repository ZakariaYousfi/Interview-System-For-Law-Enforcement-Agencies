import Audition from "./pages/Audition"
import { AdminInterface } from "./pages/admin";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";

const App = () =>  {
      return (
      <Routes>
            <Route exact path="/" element={<Auth/>} />
          <Route exact path="/home" element={<Home/>} />
          <Route path="/admin/*" element={<AdminInterface/>} />
          <Route path="/create-audition" element={<Audition/>} />
          <Route path="/open-audition" element={<Audition/>} />
      </Routes>
)

}

export default App