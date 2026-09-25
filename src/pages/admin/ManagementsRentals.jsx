import { useEffect, useState } from "react";
import {
    getRentals,
    approveRental,
    rejectRental,
    activateRental,
    completeRental,
} from "../../api/rentals";

function ManagementsRentals() {
    const [rentals, setRentals] = useState([]);

    useEffect(() => {
        loadRentals();
    }, []);

    const loadRentals = async () => {
        try {
            const response = await getRentals();
            setRentals(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleApprove = async (id) => {
        await approveRental(id);
        loadRentals();
    };

    const handleReject = async (id) => {
        await rejectRental(id);
        loadRentals();
    };

    const handleComplete = async (id) => {
        await completeRental(id);
        loadRentals();
    };

    const handleActivate = async (id) => {
        await activateRental(id);
        loadRentals();
    };
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Rental Management
            </h1>

            <div className="overflow-x-auto bg-white rounded-2xl shadow">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left">Customer</th>
                            <th className="p-4 text-left">Machine</th>
                            <th className="p-4 text-left">Start</th>
                            <th className="p-4 text-left">End</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rentals.map((rental) => (
                            <tr key={rental.id} className="border-t">
                                <td className="p-4">
                                    {rental.customer}
                                </td>

                                <td className="p-4">
                                    {rental.machine}
                                </td>

                                <td className="p-4">
                                    {rental.start_date}
                                </td>

                                <td className="p-4">
                                    {rental.end_date}
                                </td>

                                <td className="p-4">
                                    {rental.status}
                                </td>

                                <td className="p-4 flex gap-2">
                                    {rental.status === "PENDING" && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(rental.id)}
                                                className="bg-green-600 text-white px-3 py-2 rounded"
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() => handleReject(rental.id)}
                                                className="bg-red-600 text-white px-3 py-2 rounded"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}

                                    {rental.status === "APPROVED" && (
                                        <button
                                            onClick={() => handleActivate(rental.id)}
                                            className="bg-blue-600 text-white px-3 py-2 rounded"
                                        >
                                            Activate
                                        </button>
                                    )}

                                    {rental.status === "ACTIVE" && (
                                        <button
                                            onClick={() => handleComplete(rental.id)}
                                            className="bg-purple-600 text-white px-3 py-2 rounded"
                                        >
                                            Complete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManagementsRentals;