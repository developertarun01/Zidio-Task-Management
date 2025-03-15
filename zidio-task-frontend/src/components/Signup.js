import { useState } from "react";
import axios from "axios";

const Signup = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://zidio-task-management-api.vercel.app/api/auth/signup", form);
            alert("Signup Successful");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
