import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddAgents = () => {

    const [username, setUsername] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("New agent username:", username);
      // Handle the logic to add the new agent here
      setUsername("");
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8">
          <header className="bg-gray-800 text-white p-4 mb-8 flex justify-between items-center">
            <h1 className="text-2xl">اضافة ضباط اخرين الى القضية</h1>
            <Link to="/previous-page">
              <Button variant="primary">العودة الى الخلف</Button>
            </Link>
          </header>
          <main className="container mx-auto">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 font-medium mb-2">اسم المستخدم</label>
                <Input
                  id="username"
                  type="text"
                  placeholder="رجاء ادخال اسم مستخدم الضابط"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full">
              اضافة الضابط
              </Button>
            </form>
          </main>
        </div>
      );
    };


export default AddAgents