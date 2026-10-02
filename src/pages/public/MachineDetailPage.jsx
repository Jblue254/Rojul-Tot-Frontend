import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import {
    MapPin,
    Package,
    Wrench,
    ArrowLeft,
} from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import { getPublicMachines } from "../../api/machines";

function MachineDetailPage() {
    const { id } = useParams();

    const [machine, setMachine] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMachine();
    }, [id]);

    const loadMachine = async () => {
        try {
            const response = await getPublicMachines();

            const machines =
                response.data?.results ||
                response.data ||
                [];

            const foundMachine = machines.find(
                (item) => item.id === Number(id)
            );

            setMachine(foundMachine || null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const navigate = useNavigate();

    const handleRentMachine = () => {
        const token = localStorage.getItem("access");

        if (!token) {
            navigate("/login");
            return;
        }

        navigate(`/rentals/request/${machine.id}`);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "AVAILABLE":
                return "bg-green-100 text-green-700";

            case "RENTED":
                return "bg-red-100 text-red-700";

            case "MAINTENANCE":
                return "bg-yellow-100 text-yellow-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <section className="py-32 text-center">
                    <p className="text-gray-500">
                        Loading machine details...
                    </p>
                </section>
            </MainLayout>
        );
    }

    if (!machine) {
        return (
            <MainLayout>
                <section className="py-32 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Machine Not Found
                    </h2>

                    <Link
                        to="/machines"
                        className="text-[#1495CC] font-semibold"
                    >
                        Back To Machines
                    </Link>
                </section>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            {/* Hero */}

            <section className="bg-[#F8FAFC] py-20">
                <div className="max-w-7xl mx-auto px-6">

                    <Link
                        to="/machines"
                        className="inline-flex items-center gap-2 text-[#1495CC] font-semibold mb-8"
                    >
                        <ArrowLeft size={18} />
                        Back To Machines
                    </Link>

                    <div className="grid lg:grid-cols-2 gap-14 items-center">

                        {/* Image */}

                        <div className="overflow-hidden rounded-3xl shadow-xl">
                            <img
                                src={
                                    machine.image ||
                                    "https://placehold.co/800x600?text=Machine"
                                }
                                alt={machine.name}
                                className="w-full h-[500px] object-cover"
                            />
                        </div>

                        {/* Content */}

                        <div>

                            <span
                                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                                    machine.status
                                )}`}
                            >
                                {machine.status}
                            </span>

                            <h1 className="text-5xl font-bold mt-6 mb-6">
                                {machine.name}
                            </h1>

                            <p className="text-gray-600 leading-8 mb-8">
                                {machine.description}
                            </p>

                            <div className="space-y-5">

                                <div className="flex items-center gap-3">
                                    <Wrench
                                        size={20}
                                        className="text-[#1495CC]"
                                    />

                                    <span>
                                        Category:
                                        <strong className="ml-2">
                                            {machine.category_name}
                                        </strong>
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <MapPin
                                        size={20}
                                        className="text-[#1495CC]"
                                    />

                                    <span>
                                        Location:
                                        <strong className="ml-2">
                                            {machine.location}
                                        </strong>
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Package
                                        size={20}
                                        className="text-[#1495CC]"
                                    />

                                    <span>
                                        Quantity Available:
                                        <strong className="ml-2">
                                            {machine.quantity}
                                        </strong>
                                    </span>
                                </div>

                            </div>

                            <div className="mt-10 p-6 rounded-2xl bg-white shadow-md">
                                <p className="text-gray-500 mb-2">
                                    Rental Price
                                </p>

                                <h2 className="text-4xl font-bold text-[#1495CC]">
                                    KSh{" "}
                                    {Number(
                                        machine.price_per_day
                                    ).toLocaleString()}
                                    <span className="text-lg text-gray-500">
                                        {" "}
                                        / day
                                    </span>
                                </h2>
                            </div>

                            <div className="mt-10">
                                <button
                                    onClick={handleRentMachine}
                                    className="w-full bg-[#1495CC] text-white py-4 rounded-xl font-semibold"
                                >
                                    Request Rental
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}

            <section className="py-24 bg-[#1495CC] text-white">
                <div className="max-w-5xl mx-auto px-6 text-center">

                    <h2 className="text-4xl font-bold mb-6">
                        Need This Machine For Your Project?
                    </h2>

                    <p className="text-xl text-white/90 mb-8">
                        Contact our team today for rental
                        availability, pricing, and scheduling.
                    </p>

                    <Link
                        to="/contact"
                        className="inline-flex px-8 py-4 rounded-xl bg-white text-[#1495CC] font-semibold hover:bg-gray-100 transition"
                    >
                        Contact Us
                    </Link>

                </div>
            </section>
        </MainLayout>
    );
}

export default MachineDetailPage;