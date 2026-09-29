import { useEffect, useState } from "react";
import { getManagerDashboard } from "../../api/analytics";

function ManagerDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const response =
                await getManagerDashboard();

            setStats(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    if (!stats) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">
                Manager Dashboard
            </h1>

            <p>
                Projects: {stats.projects}
            </p>
        </div>
    );
}

export default ManagerDashboard;