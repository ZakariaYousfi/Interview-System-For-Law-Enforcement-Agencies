import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component
import { useState } from 'react';

const CreateCase = () => {

    const [caseType, setCaseType] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("New case type:", caseType);
        console.log("Description:", description);
        // Handle the logic to create the new case here
        setCaseType("");
        setDescription("");
      };

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