import "../App.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { Link } from 'react-router-dom';

function Audition() {

  const q = useRef('')
  const a = useRef('')
  const [pairs, setPairs] = useState([]);

  const add = async (e) => {

    e.preventDefault()

    const pair = {
      q: q.current.value,
      a: a.current.value
    }

    q.current.value = ''
    a.current.value = ''

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
    } else {
      console.error("Failed to add pair");
    }

  }

  
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/home">
        <Button variant="primary">إلغاء المقابلة</Button>
      </Link>
      <div className="text-right">
        <p className="text-lg font-semibold">personType</p>
        <p className="text-sm">Name: personName</p>
        <p className="text-sm">Birthdate: birthDate</p>
        <p className="text-sm">Number: personNumber</p>
      </div>
    </header>
      <div className="flex flex-grow">
        <main className="flex-grow overflow-y-auto p-4 bg-white">
          {pairs.map((pair, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg shadow-sm">
              <h2 className="text-lg font-bold">Question: {pair.q}</h2>
              <p className="mt-2">Answer: {pair.a}</p>
            </div>
          ))}
        </main>
        <aside className="bg-gray-200 w-1/4 p-4">
          {/* Placeholder for future content */}
        </aside>
      </div>
      <footer className="bg-gray-800 p-4 fixed bottom-0 w-3/4">
        <form onSubmit={add} >
          <Input id="q" placeholder="سؤال" ref={q} className="flex-grow mb-1" />
          <Input id="a" placeholder="جواب" ref={a} className="flex-grow mb-1" />
          <Button type="submit">تأكيد</Button>
        </form>
      </footer>
    </div>
  );
}

export default Audition;
