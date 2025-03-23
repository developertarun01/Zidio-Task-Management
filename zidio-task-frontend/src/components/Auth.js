// import React, { useState } from "react";
// import { auth, googleProvider, signInWithPopup } from "../firebaseConfig";
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// const Auth = ({ isSignup }) => {
//     const [username,setUsername] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const navigate = useNavigate();

//     const handleAuth = async (e) => {
//         e.preventDefault();
//         try {
//             if (isSignup) {
//                 await createUserWithEmailAndPassword(auth,username, email, password);
//             } else {
//                 await signInWithEmailAndPassword(auth, email, password);
//             }
//             navigate("/dashboard"); // Redirect to dashboard after login/signup
//         } catch (error) {
//             alert(error.message);
//         }
//     };

//     const handleGoogleSignIn = async () => {
//         try {
//             await signInWithPopup(auth, googleProvider);
//             navigate("/dashboard");
//         } catch (error) {
//             alert(error.message);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center bg-white">
//             <div className="bg-blue-50 p-8 rounded-lg shadow-lg w-96">
//                 <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
//                     {isSignup ? "Sign Up" : "Login"}
//                 </h2>
//                 <form onSubmit={handleAuth}>
//                     <input
//                         type="username"
//                         placeholder="Username"
//                         className="w-full p-2 mb-4 border rounded"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                     />
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         className="w-full p-2 mb-4 border rounded"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         className="w-full p-2 mb-4 border rounded"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                     <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
//                         {isSignup ? "Sign Up" : "Login"}
//                     </button>
//                 </form>
//                 <button onClick={handleGoogleSignIn} className="w-full bg-red-500 text-white p-2 mt-4 rounded">
//                     Sign in with Google
//                 </button>
//                 <p className="text-center mt-4">
//                     {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
//                     <a href={isSignup ? "/login" : "/signup"} className="text-blue-500">
//                         {isSignup ? "Login" : "Sign Up"}
//                     </a>
//                 </p>
//             </div>
//         </div>
//     );
//     try {
//       const API_BASE_URL = "https://zidio-task-management-api.vercel.app";
//       const endpoint = isSignup ? `${API_BASE_URL}/api/auth/signup` : `${API_BASE_URL}/api/auth/login`;

//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       console.log("API Response:", data); // ✅ Debugging Log

//       if (!response.ok) throw new Error(data.message || "Something went wrong!");

//       if (!isSignup) {
//         login(data);  // ✅ This should update user context
//         console.log("User logged in:", data); // ✅ Debugging Log
//         navigate("/home"); // ✅ Redirect
//       } else {
//         navigate("/");
//       }
//     } catch (error) {
//       setError(error.message);
//       console.error("Login Error:", error);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center">
//       <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg mx-12">
//         <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
//           {isSignup ? "Sign Up" : "Login"}
//         </h2>
//         {error && <p className="text-red-500 text-center">{error}</p>}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {isSignup && (
//             <input
//               type="text"
//               name="username"
//               placeholder="Full Name"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//           >
//             {isSignup ? "Sign Up" : "Login"}
//           </button>
//         </form>
//         <p className="mt-4 text-center">
//           {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
//           <button
//             onClick={() => navigate(isSignup ? "/" : "/signup")}
//             className="text-blue-500"
//           >
//             {isSignup ? "Login" : "Sign Up"}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// >>>>>>> 52ed5ea1354646c22e266963d6cffaf569cc9e2f
// };

// export default Auth;