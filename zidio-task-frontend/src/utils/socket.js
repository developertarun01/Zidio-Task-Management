import { io } from "socket.io-client";

const socket = io("https://zidio-task-management-tanmoy9088.onrender.com"); // Adjust to match backend

export default socket;
