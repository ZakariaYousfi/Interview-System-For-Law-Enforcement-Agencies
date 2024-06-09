import "../App.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import audition from "./a1";

function Audition() {

  const personData = useSelector(state => state.audition)
  const [pairs, setPairs] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [isCustomQuestion, setIsCustomQuestion] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [customQuestion, setCustomQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [gapFill, setGapFill] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");

  const predefinedQuestions = [
    "___ ما علاقتك مع",
    " اين كنت يوم "
  ];

  const add = async (e) => {

    e.preventDefault()

    const question = isCustomQuestion
    ? customQuestion
    : (selectedQuestion.includes("___") 
    ? selectedQuestion.replace("___", gapFill) 
    : selectedQuestion + year + "|" + month + "|" + day + "|" + hour)

    const pair = {
      q: question,
      a: answer
    }

    const url = import.meta.env.VITE_JSON_SERVER_URL 

    console.log(url)
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      dataType: 'json',
      data: pair,
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
      body: JSON.stringify(pair), // body data type must match "Content-Type" header
    });
    const jsonResponse = await response.json();
    console.log(jsonResponse) // parses JSON response into native JavaScript objects

    if (response.ok) {
      setPairs((prevPairs) => [...prevPairs, jsonResponse]);
      setCustomQuestion("")
      setAnswer("")
    } else {
      console.error("Failed to add pair");
    }

  }

  const handleQuestionTypeChange = () => {
    setIsCustomQuestion(!isCustomQuestion);
    setCustomQuestion("");
    setSelectedQuestion("");
  };


  const getRecommendation = async () => {
  
      const pair = pairs[pairs.length - 1]
  
      const url = import.meta.env.VITE_JSON_SERVER_URL + '/recommendation'
  
      console.log(url)
      const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        dataType: 'json',
        data: pair,
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
        body: JSON.stringify(pair), // body data type must match "Content-Type" header
      });
      const jsonResponse = await response.json();
      console.log(jsonResponse) // parses JSON response into native JavaScript objects
  
      if (response.ok) {
        console.log(jsonResponse)
        setRecommended(jsonResponse)
      } else {
        console.error("Recommendation failed");
      } 
  }
  
  
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/home">
        <Button variant="primary">إلغاء الجلسة</Button>
      </Link>
      <Button variant="primary">إغلاق الجلسة</Button>
      <div className="text-right">
        <p className="text-lg font-semibold">{personData.type}</p>
        <p className="text-sm">{personData.name} : الاسم</p>
        <p className="text-sm">{personData.birthDate} : تاريخ الميلاد</p>
        <p className="text-sm">{personData.number} : الرقم</p>
      </div>
    </header>
      <div className="flex flex-grow">
        <main className="flex-grow overflow-y-auto p-4 bg-white">
          {pairs.map((pair, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg shadow-sm">
              <h2 className="text-lg font-bold">{pair.q} : السؤال</h2>
              <p className="mt-2">{pair.a} : الجواب</p>
            </div>
          ))}
        </main>
        <aside className="bg-gray-200 p-4 w-1/4 overflow-y-auto">
          {/* Placeholder for future content */}
          <Button onClick = { getRecommendation }>طلب اسئلة مقترحة</Button>
          <h2 className="text-xl font-semibold mb-4 mt-2">{recommended.length ? ':الأسئلة المقترحة' : ''}</h2>
  <ul className="space-y-4">
    {recommended.map((question, i) => (
      <li key={i} className="bg-white p-4 rounded-lg shadow-md">
        <span className="block text-gray-800 font-medium">{question}؟</span>
        <hr className="my-2 border-gray-300" />
      </li>
    ))}
  </ul>
        </aside>
      </div>
      <footer className="bg-gray-800 p-4 fixed bottom-0 w-3/4">
      <form onSubmit={add} className="space-y-4">
        <div className="flex items-center space-x-4">
          {isCustomQuestion ? (
            <Input
              type="text"
              placeholder="اكتب سؤالك"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              className="flex-grow mb-1"
            />
          ) : (
            <div className="flex flex-grow space-x-2">
              {selectedQuestion.includes("___") ? (
                <Input
                  type="text"
                  placeholder="املأ الفراغ"
                  value={gapFill}
                  onChange={(e) => setGapFill(e.target.value)}
                  className="flex-grow mb-1"
                />
              ) :
              selectedQuestion != "" &&
              <>
              <Input
                id="Year"
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="العام"
                className="flex-grow"
              />
              <Input
                id="Month"
                type="text"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="الشهر"
                className="flex-grow"
              />
              <Input
                id="Day"
                type="text"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="اليوم"
                className="flex-grow"
              />
                <Input
                id="Hour"
                type="text"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                placeholder="الساعة"
                className="flex-grow"
              />
              </>
            }
              <select
                value={selectedQuestion}
                onChange={(e) => setSelectedQuestion(e.target.value)}
                className="flex-grow p-2 bg-white text-black rounded"
              >
                <option value="" disabled>
                حدد سؤالاً محدد مسبقًا
                </option>
                {predefinedQuestions.map((question, index) => (
                  <option key={index} value={question}>
                    {question}
                  </option>
                ))}
              </select>
            </div>
          )}
          <Button onClick={handleQuestionTypeChange} type="button">
            {isCustomQuestion ? "استخدم سؤال محدد مسبقًا" : "استخدم سؤال خاص"}
          </Button>
        </div>
        <div>
          <Input
            type="text"
            placeholder="أكتب الاجابة"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="flex-grow mb-1"
          />
        </div>
        <Button type="submit" className="flex-grow mb-1">
        تأكيد
        </Button>
      </form>
    </footer>
   { /*  <footer className="bg-gray-800 p-4 fixed bottom-0 w-3/4">
        <form onSubmit={add} >
          <Input id="q" placeholder="سؤال" ref={q} className="flex-grow mb-1" />
          <Input id="a" placeholder="جواب" ref={a} className="flex-grow mb-1" />
          <Button type="submit">تأكيد</Button>
        </form>
      </footer>*/}
    </div>
  );
}


export default Audition;
