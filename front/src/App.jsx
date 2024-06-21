import Audition from "./pages/Audition"
import { AdminInterface } from "./pages/admin";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import AuditionInfo from "./pages/AuditionInfo";
import Affaires from "./pages/Affaires";
import AddAgents from "./pages/AddAgents";
import CreateCase from "./pages/CreateCase";
import Auditions from "./pages/Auditions";
import AuditionDone from "./pages/AuditionDone";

const App = () =>  {
      return (
      <Routes>
            <Route exact path="/" element={<Auth/>} />
            <Route exact path="/affaires" element={<Affaires/>} />
          <Route exact path="/home" element={<Home/>} />
          <Route path="/admin/*" element={<AdminInterface/>} />
          <Route path="/create-audition" element={<AuditionInfo/>} />
          <Route path="/audition" element={<Audition/>} />
          <Route path="/add-agents" element={<AddAgents/>} />
          <Route path="/create-case" element={<CreateCase/>} />
          <Route path="/auditions" element={<Auditions/>} />
          <Route path="/audition/:auditionId" element={<AuditionDone/>} />
      </Routes>
)

}

export default App