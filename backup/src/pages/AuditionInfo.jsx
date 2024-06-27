// src/PersonForm.js
import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup} from "@/components/ui/select";
import "../App.css"; // Assuming you have your custom CSS here
import { setInfo } from "../features/audition/auditionSlice";
import { useDispatch } from "react-redux";

function AuditionInfo() {
  const [personType, setPersonType] = useState("");
  const [personName, setPersonName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [personNumber, setPersonNumber] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    const personData = {
      personType,
      personName,
      birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
      personNumber,
    };

    dispatch(setInfo(personData))

    console.log(personData);

    // Example: Redirect to another page on successful submission
    navigate("/audition");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">يرجى إدخال بيانات الجلسة</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="personType" className="block text-gray-700">
            نوع الشخص
            </label>
            <Select
              id="personType"
              onValueChange={(value) => setPersonType(value)}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="حدد نوع الشخص" />
                </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>نوع الشخص</SelectLabel>
              <SelectItem value="مشتبه به">مشتبه به</SelectItem>
              <SelectItem value="شاهد">شاهد</SelectItem>
              <SelectItem value="ضحية">ضحية</SelectItem>
              </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="personName" className="block text-gray-700">
              اسم الشخص
            </label>
            <Input
              id="personName"
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="يرجى إدخال اسم الشخص"
              className="w-full mt-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">تاريخ الميلاد</label>
            <div className="flex space-x-2 mt-2">
              <Input
                id="birthYear"
                type="text"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder="العام"
                className="flex-grow"
              />
              <Input
                id="birthMonth"
                type="text"
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                placeholder="الشهر"
                className="flex-grow"
              />
              <Input
                id="birthDay"
                type="text"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                placeholder="اليوم"
                className="flex-grow"
              />
            </div>
          </div>
          <div>
            <label htmlFor="personNumber" className="block text-gray-700">
              رقم الشخص
            </label>
            <Input
              id="personNumber"
              type="text"
              value={personNumber}
              onChange={(e) => setPersonNumber(e.target.value)}
              placeholder="يرجى إدخال رقم الشخص"
              className="w-full mt-2"
            />
          </div>
          <Button type="submit" className="w-full mt-6">
          تأكيد 
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AuditionInfo;
