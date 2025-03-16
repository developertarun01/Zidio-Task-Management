import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Signup = () => {
     const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           const response = await axios.post("https://zidio-task-management-api.vercel.app/api/auth/signup", {
        username,
        email,
        password,
      });
      console.log(response);
      
      if (response.status === 201) {
        alert(response.data.message);

        // Redirect to home page after successful registration
        navigate('/home');
      }
        } catch (err) {
            console.error(err);
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" value={username} onChange={(e) => setUsername({ e.target.value })} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail({ e.target.value })} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword({ e.target.value })} required />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
