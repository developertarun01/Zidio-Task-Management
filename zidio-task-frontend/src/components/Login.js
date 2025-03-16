import { useState } from "react";
import axios from "axios";

const Login = () => {
   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://zidio-task-management-api.vercel.app/api/auth/login",{
         email,
        password,
      });
       if (response.status === 200) {
        alert(response.data.message);

        // Store token in localStorage or sessionStorage
        localStorage.setItem('token', response.data.token);

        // Redirect to home page after login
        navigate('/home');
      }
    } catch (err) {
      console.error(err);
      alert( 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail( e.target.value )} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword( e.target.value )} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
