import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
            <button
                className="mt-4 bg-red-500 text-white p-2 rounded"
                onClick={() => navigate("/")}
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
