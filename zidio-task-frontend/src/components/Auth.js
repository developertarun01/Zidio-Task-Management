import React, { useState } from "react";
import { auth, googleProvider, signInWithPopup } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Auth = ({ isSignup }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            if (isSignup) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            navigate("/dashboard"); // Redirect to dashboard after login/signup
        } catch (error) {
            alert(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/dashboard");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center bg-white">
            <div className="bg-blue-50 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
                    {isSignup ? "Sign Up" : "Login"}
                </h2>
                <form onSubmit={handleAuth}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 mb-4 border rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 mb-4 border rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                        {isSignup ? "Sign Up" : "Login"}
                    </button>
                </form>
                <button onClick={handleGoogleSignIn} className="w-full bg-red-500 text-white p-2 mt-4 rounded">
                    Sign in with Google
                </button>
                <p className="text-center mt-4">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                    <a href={isSignup ? "/login" : "/signup"} className="text-blue-500">
                        {isSignup ? "Login" : "Sign Up"}
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Auth;