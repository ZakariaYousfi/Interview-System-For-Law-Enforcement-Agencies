import "../App.css";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import audition3 from "./a3";

function Audition() {

  let params = useParams()
  console.log(params.auditionId)

  // Api call to get audition data + check contradicition and report it
  let personData = useSelector(state => state.audition)
  const [pairs, setPairs] = useState([]);
  const [contradiction, setContradictions] = useState([]);
  const contradictions = ['تناقض بين علاقة زرقاوي خيثر مع زرقاوي سمير ابني ضد صديقي',
    'تناقض  بين مكان الوجود يوم 2024-5-20-16-8 الجزائر-باب الواد ضد الجزائر-بوزريعة']
  personData = {
    type: "مشتبه به",
    birthDate: '1970/10/15',
    name: "زرقاوي خيثر",
    number: 25849462,
  }
  const getContradiction = async () => {

    const url = import.meta.env.VITE_JSON_SERVER_URL + '/contradiction'
  
    console.log(url)
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      dataType: 'json',
      data: pairs,
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
      body: JSON.stringify(pairs), // body data type must match "Content-Type" header
    });
    const jsonResponse = await response.json();
    console.log(jsonResponse) // parses JSON response into native JavaScript objects

    if (response.ok) {
      console.log(jsonResponse)
      setPairs(jsonResponse.audition)
      setContradictions(jsonResponse.contradiction)
    } else {
      console.error("Contradiction detection failed");
    } 
  }
  
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/home">
        <Button variant="primary">العودة الى الجلسات</Button>
      </Link>
      <Button variant="primary" onClick = {getContradiction}>جلسة مغلقة</Button>
      <div className="text-right">
        <p className="text-lg font-semibold">{personData.type}</p>
        <p className="text-sm">الاسم : {personData.name}</p>
        <p className="text-sm">{personData.birthDate} : تاريخ الميلاد</p>
        <p className="text-sm">{personData.number} : الرقم</p>
      </div>
    </header>
      <div className="flex flex-grow">
        <main className="flex-grow overflow-y-auto p-4 bg-white">
          {audition3.content.map((pair, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg shadow-sm">
              <h2 className="text-lg"> <span className="font-bold">سؤال : </span>{pair.q}؟</h2>
              <p className="mt-2"><span className="font-bold">جواب : {pair.a}</span></p>
            </div>
          ))}
        </main>
        <aside className="bg-gray-200 p-4 w-1/4 overflow-y-auto">
          {/* Placeholder for future content */}
          <h2 className="text-xl font-semibold mb-4 mt-2">{contradictions.length ? 'التناقضات التي وجدت' : ''}</h2>
  <ul className="space-y-4">
    {contradictions.map((contradiction, i) => (
      <li key={i} className="bg-white p-4 rounded-lg shadow-md">
        <span className="block text-gray-800 font-medium">{contradiction}</span>
        <hr className="my-2 border-gray-300" />
      </li>
    ))}
  </ul>
        </aside>
      </div>
      { /* 
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
                <Input
                id="Duration"
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="المدة بالساعات"
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
          { selectedQuestion === " اين كنت يوم " ? 
          (
            <div className="flex flex-grow space-x-2">
            <Input
            id="Wilaya"
            type="text"
            value={wilaya}
            onChange={(e) => setWilaya(e.target.value)}
            placeholder="الولاية"
            className="flex-grow"
          />
          <Input
            id="daira"
            type="text"
            value={daira}
            onChange={(e) => setDaira(e.target.value)}
            placeholder="الدائرة"
            className="flex-grow"
          />
          <Input
            id="commune"
            type="text"
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
            placeholder="البلدية"
            className="flex-grow"
          />
            <Input
            id="adresse"
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            placeholder="العنوان"
            className="flex-grow"
          />
          </div>
          )
          :
          <Input
            type="text"
            placeholder="أكتب الاجابة"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="flex-grow mb-1"
          />
        }
        </div>
        <Button type="submit" className="flex-grow mb-1">
        تأكيد
        </Button>
      </form>
    </footer>
 <footer className="bg-gray-800 p-4 fixed bottom-0 w-3/4">
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
