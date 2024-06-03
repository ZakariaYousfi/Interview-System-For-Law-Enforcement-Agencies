// src/AuthPage.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "../App.css"; // Assuming you have your custom CSS here
import { useDispatch } from "react-redux";
import { setAuth } from "../features/agent/agentSlice";
function Auth() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle authentication logic here
    console.log("Username:", username);
    console.log("Password:", password);

    const url = import.meta.env.VITE_JSON_SERVER_URL + '/auth'

    const credentials = {
      username: username,
      password: password
    }
    // Example: Redirect to another page on successful login
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      dataType: 'json',
      data: credentials,
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
      body: JSON.stringify(credentials), // body data type must match "Content-Type" header
    });

    if(response.status == 401) {
      alert("اسم المستخدم او الرقم السري خاطئ")
    } else {
    const jsonResponse = await response.json();
    console.log(jsonResponse) // parses JSON response into native JavaScript objects

    if (response.ok) {
      dispatch(setAuth({...credentials, name: jsonResponse.name}))
      navigate("/home");
    }
  }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">نظام المقابلات</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700">
              اسم المستخدم
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم الخاص بك"
              className="w-full mt-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">
            كلمة المرور
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل رقمك السري"
              className="w-full mt-2"
            />
          </div>
          <Button type="submit" className="w-full mt-6">
            تسجيل الدخول
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
