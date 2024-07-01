import "../App.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link} from 'react-router-dom';
import { useSelector, useDispatch} from "react-redux";
import { setContradictions } from "../features/audition/auditionSlice";
import { useNavigate } from "react-router-dom";
function Audition() {

  const personData = useSelector(state => state.audition)
  const agentData = useSelector(state => state.agent)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const type = agentData.affaires.find((affaire) => affaire.id == agentData.currentAffaire).type

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
  const [duration, setDuration] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [daira, setDaira] = useState("");
  const [commune, setCommune] = useState("");
  const [adresse, setAdresse] = useState("");
  const predefinedQuestions = [
    "___ ما علاقتك مع",
    " اين كنت يوم "
  ];

  const add = async (e) => {

    e.preventDefault()
    let person = ''
    let pairs = {}
    if(!isCustomQuestion){

      if(selectedQuestion.includes("___")){
      // we know it's a person person relation question
      person = gapFill 
      let question = selectedQuestion.replace("___", '') 
      setGapFill('')
      question = question + ' ' + person
      pairs.relatedPerson = person
      pairs.q = question
      pairs.a = answer
      pairs.type = 'pp'
      } else {
      // we know it's a person location relation
      let question = selectedQuestion + year + "-" + month + "-" + day + "-" + hour + "-" + duration
      let answer = wilaya + "-" + daira + "-" + commune + "-" + adresse
      pairs.q = question 
      pairs.a = answer
      pairs.type = 'pl'
      pairs.year = year
      pairs.month = month
      pairs.day = day
      pairs.hour = hour
      pairs.duration = duration 
      pairs.wilaya = wilaya
      pairs.daira = daira
      pairs.commune = commune
      pairs.adresse = adresse
      }
    }else {
      // we know it's a question without relation
      pairs.q = customQuestion
      pairs.a = answer
      pairs.type = 'no'
    }
    setPairs((prevPairs) => [...prevPairs, pairs])
    setCustomQuestion("")
    setAnswer("")

  }

  const close = async () => {


    const url = import.meta.env.VITE_JSON_SERVER_URL + '/audition'

    let pData = {
      name: personData.name,
      type: personData.type,
      birthDate: personData.birthDate,
      number: personData.number,
      caseId: agentData.currentAffaire
    }

    const data = {
      qData : pairs,
      pData : pData
    }

    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      dataType: 'json',
      data: data,
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
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    const jsonResponse = await response.json();
    console.log(jsonResponse) // parses JSON response into native JavaScript objects

    if (response.ok) {
      dispatch(setContradictions({contradictions:jsonResponse.contradiction, qData: jsonResponse.qData}))
      navigate('/audition/1')
    } else {
      console.error("Contradiction detection failed");
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

      const data = {
        q: pair.q,
        a: pair.a,
        caseType: type,
        auditionType: personData.type
      }

      console.log(url)
      const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        dataType: 'json',
        data: data,
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
        body: JSON.stringify(data), // body data type must match "Content-Type" header
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

  /*
  const goToContradiction = async () => {

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
    } else {
      console.error("Contradiction detection failed");
    } 
  }
  */
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/home">
        <Button variant="primary">إلغاء الجلسة</Button>
      </Link>
      <Button variant="primary" onClick = {close}>إغلاق الجلسة</Button>
      <div className="text-right">
        <p className="text-lg font-semibold">{personData.type}</p>
        <p className="text-sm">الاسم : {personData.name}</p>
        <p className="text-sm">{personData.birthDate} : تاريخ الميلاد</p>
        <p className="text-sm">{personData.number} : الرقم</p>
      </div>
    </header>
      <div className="flex flex-grow">
        <main className="flex-grow overflow-y-auto p-4 bg-white">
          {pairs.map((pair, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg shadow-sm">
              <h2 className="text-lg"> <span className="font-bold">سؤال : </span>{pair.q}؟</h2>
              <p className="mt-2"><span className="font-bold">جواب : {pair.a}</span></p>
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
