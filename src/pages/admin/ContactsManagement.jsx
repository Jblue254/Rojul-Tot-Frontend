import { useEffect, useState } from "react";
import {
    Mail,
    Phone,
    Trash2,
    Eye,
    MessageSquare,
    Inbox,
} from "lucide-react";

import {
    getContactMessages,
    updateContactMessage,
    deleteContactMessage,
} from "../../api/contact";

const BADGES = {
    NEW: "bg-red-100 text-red-700",
    READ: "bg-yellow-100 text-yellow-700",
    RESPONDED: "bg-green-100 text-green-700",
};

const getBadge = (status) => BADGES[status] || "bg-gray-100 text-gray-700";

function ContactsManagement() {
    const [messages, setMessages] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadMessages = async () => {
        try {
            const response = await getContactMessages();
            const list = response.data?.results || response.data || [];
            setMessages(list);
        } catch (error) {
            console.error("Contact Error:", error);
            console.error("Response:", error.response?.data);
            console.error("Status:", error.response?.status);

            alert("Failed to load messages.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await updateContactMessage(id, { status });

            // keep the open details panel in sync with the new status
            setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
            loadMessages();
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkRead = (id) => updateStatus(id, "READ");
    const handleMarkResponded = (id) => updateStatus(id, "RESPONDED");

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Delete this contact message?");
        if (!confirmed) return;

        try {
            await deleteContactMessage(id);

            if (selected?.id === id) {
                setSelected(null);
            }

            loadMessages();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <div className="text-gray-500">Loading messages...</div>;
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
                <p className="text-gray-500 mt-2">Manage customer inquiries.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Messages List */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="font-bold text-gray-900">
                            Messages ({messages.length})
                        </h2>
                    </div>

                    <div className="max-h-[700px] overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="p-10 text-center text-gray-500 flex flex-col items-center gap-2">
                                <Inbox size={28} className="text-gray-300" />
                                No messages found.
                            </div>
                        ) : (
                            messages.map((message) => {
                                const isSelected = selected?.id === message.id;

                                return (
                                    <button
                                        key={message.id}
                                        type="button"
                                        onClick={() => setSelected(message)}
                                        className={`w-full text-left p-4 border-b border-gray-100 border-l-4 transition-colors focus:outline-none focus-visible:bg-blue-50 ${
                                            isSelected
                                                ? "bg-blue-50 border-l-[#1495CC]"
                                                : "border-l-transparent hover:bg-blue-50/60"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <h3
                                                className={`truncate ${
                                                    isSelected
                                                        ? "font-semibold text-[#1495CC]"
                                                        : "font-semibold text-gray-900"
                                                }`}
                                            >
                                                {message.name}
                                            </h3>

                                            <span
                                                className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium ${getBadge(
                                                    message.status
                                                )}`}
                                            >
                                                {message.status}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 truncate">
                                            {message.subject}
                                        </p>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
                    {!selected ? (
                        <div className="h-full min-h-[300px] flex flex-col items-center justify-center gap-3 text-gray-500 p-12">
                            <MessageSquare size={32} className="text-gray-300" />
                            Select a message to view details
                        </div>
                    ) : (
                        <div className="p-8">
                            <div className="flex justify-between items-start gap-4 mb-6">
                                <div className="min-w-0">
                                    <h2 className="text-2xl font-bold text-gray-900 break-words">
                                        {selected.subject}
                                    </h2>

                                    <span
                                        className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getBadge(
                                            selected.status
                                        )}`}
                                    >
                                        {selected.status}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(selected.id)}
                                    aria-label="Delete message"
                                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 mb-8 text-gray-700">
                                <div className="flex items-center gap-3">
                                    <MessageSquare size={18} className="text-[#1495CC]" />
                                    <span>{selected.name}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail size={18} className="text-[#1495CC]" />
                                    <a
                                        href={`mailto:${selected.email}`}
                                        className="hover:text-[#1495CC] transition-colors"
                                    >
                                        {selected.email}
                                    </a>
                                </div>

                                {selected.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone size={18} className="text-[#1495CC]" />
                                        <a
                                            href={`tel:${selected.phone}`}
                                            className="hover:text-[#1495CC] transition-colors"
                                        >
                                            {selected.phone}
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-6 mb-8">
                                <p className="whitespace-pre-line text-gray-700 break-words">
                                    {selected.message}
                                </p>
                            </div>

                            <div className="flex gap-3 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => handleMarkRead(selected.id)}
                                    className="bg-yellow-500 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-yellow-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
                                >
                                    <Eye size={18} />
                                    Mark Read
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleMarkResponded(selected.id)}
                                    className="bg-green-600 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-green-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                                >
                                    <Mail size={18} />
                                    Mark Responded
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ContactsManagement;