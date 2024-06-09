import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Assuming you have a Card component
import { setCurrentAffaire } from "../features/agent/agentSlice";

const Affaires = () => {
        
    const authData = useSelector(state => state.agent)
    console.log(authData)
    const navigate = useNavigate();
    const dispatch = useDispatch()
  const handleCaseClick = (currentAffaire) => {
    console.log("id:" + currentAffaire)
    dispatch(setCurrentAffaire({ currentAffaire: currentAffaire}))
    navigate("/home");
  };
    return (
        <div className="bg-gray-100 min-h-screen p-8">
          <header className="bg-gray-800 text-white p-4 mb-8 flex justify-between items-center">
            <h1 className="text-2xl">!مرحبا {authData.name}</h1>
            <Link to="/create-case">
              <Button variant="primary">انشاء قضية جديدة</Button>
            </Link>
            <Link to="/home">
              <Button variant="primary">تسجيل الخروج</Button>
            </Link>
          </header>
          <main className="container mx-auto">
            <h2 className="text-xl font-semibold mb-6">القاضايا الحالية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authData.affaires.map((affaire) => (
                <Card
                  key={affaire.id}
                  className="p-4 bg-white rounded shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleCaseClick(affaire.id)}
                >
                  <h3 className="text-lg font-bold">{affaire.type}</h3>
                  <p className="text-gray-700">{affaire.description}</p>
                </Card>
              ))}
            </div>
          </main>
        </div>
      );
}


export default Affaires