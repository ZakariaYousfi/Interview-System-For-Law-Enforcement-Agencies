import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component
import { useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { setAuth } from '../features/agent/agentSlice';
const CreateCase = () => {

    const [caseType, setCaseType] = useState("");
    const [description, setDescription] = useState("");
    const agentData = useSelector(state => state.agent);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("New case type:", caseType);
        console.log("Description:", description);
        // Handle the logic to create the new case here
        const url = import.meta.env.VITE_JSON_SERVER_URL + '/case'

        const caseDetails = {
          caseType: caseType,
          description: description,
          agentId : agentData.id
        }
        // Example: Redirect to another page on successful login
        const response = await fetch(url, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          dataType: 'json',
          data: caseDetails,
          xhrFields: {
             withCredentials: true
          },
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(caseDetails), // body data type must match "Content-Type" header
        });
    
        if(response.status == 401) {
          alert("اسم المستخدم او الرقم السري خاطئ")
        } else {
        const jsonResponse = await response.json();
        console.log(jsonResponse) // parses JSON response into native JavaScript objects
        agentData.affaires.push(jsonResponse.affaire)
        if (response.ok) {
          dispatch(setAuth({...agentData, currentAffaire: jsonResponse.currentAffaire}))
          navigate("/affaires");
        }
        setCaseType("");
        setDescription("");
      }
    }
    return (
            <div className="bg-gray-100 min-h-screen p-8">
      <header className="bg-gray-800 text-white p-4 mb-8 flex justify-between items-center">
        <h1 className="text-2xl">انشاء قضية جديدة</h1>
        <Link to="/previous-page">
          <Button variant="primary">العودة الى الخلف</Button>
        </Link>
      </header>
      <main className="container mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="caseType" className="block text-gray-700 font-medium mb-2">نوع القضية</label>
            <Input
              id="caseType"
              type="text"
              placeholder="ادخل نوع القضية"
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2"> وصف القضية</label>
            <Textarea
              id="description"
              placeholder="ادخل وصف القضية"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            انشاء القضية
          </Button>
        </form>
      </main>
    </div>
    )
}

export default CreateCase