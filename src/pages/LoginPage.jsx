import React from "react";
import { loginUser } from "../API/userAPI.js";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function LoginPage() {
  const [loginData, setLoginData] = React.useState({
    usernameOremail: "",
    password: "",
  });
  const [error, setError] = React.useState(null);
  const [status, setStatus] = React.useState("idle");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");

    loginUser(loginData)
      .then((data) => {
        console.log(data);
        setStatus("idle");
        navigate("/");
        window.location.reload(); // Force page reload after navigating
      })
      .catch((error) => {
        setError(error.message || "Login failed");
        setStatus("idle");
      });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center self-center ">
      <div className="items-center text-center mt-40">
        <h1 className="text-4xl font-bold pb-9 text-white">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <input
              type="text"
              className="border-2 p-2 m-2 bg-transparent shadow-lg text-white border-slate-800 rounded-lg"
              placeholder="Username or Email"
              onChange={handleChange}
              name="usernameOremail"
              value={loginData.usernameOremail}
            />
            <input
              type="password"
              className="border-2 p-2 m-2 bg-transparent shadow-lg text-white border-slate-800 rounded-lg"
              placeholder="Password"
              onChange={handleChange}
              name="password"
              value={loginData.password}
            />
            <button
              className="bg-blue-400 p-2 m-2 rounded"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500">{error}</p>}
        <h3 className="text-white">
          Don't have an account?{" "}
          <NavLink to="/register" className="text-blue-600">
            {" "}
            Register{" "}
          </NavLink>{" "}
          Here
        </h3>
      </div>
    </div>
  );
}