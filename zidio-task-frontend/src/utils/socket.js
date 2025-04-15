import { io } from "socket.io-client";

const socket = io("http://localhost:4004"); // Adjust to match backend

export default socket;
