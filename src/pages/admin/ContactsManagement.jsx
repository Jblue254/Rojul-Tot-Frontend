import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  Trash2,
  Eye,
  MessageSquare,
} from "lucide-react";

import {
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
} from "../../api/contact";

function ContactsManagement() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    try {
      const response = await getContactMessages();

      const list =
        response.data?.results ||
        response.data ||
        [];

      setMessages(list);
    } catch (error) {
  console.error("Contact Error:", error);
  console.error("Response:", error.response?.data);
  console.error("Status:", error.response?.status);

  alert("Failed to send message.");
}
     finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await updateContactMessage(id, {
        status: "READ",
      });

      loadMessages();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkResponded = async (id) => {
    try {
      await updateContactMessage(id, {
        status: "RESPONDED",
      });

      loadMessages();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this contact message?"
    );

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

  const getBadge = (status) => {
    switch (status) {
      case "NEW":
        return "bg-red-100 text-red-700";

      case "READ":
        return "bg-yellow-100 text-yellow-700";

      case "RESPONDED":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Contact Messages
        </h1>

        <p className="text-gray-500 mt-2">
          Manage customer inquiries.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-bold">
              Messages ({messages.length})
            </h2>
          </div>

          <div className="max-h-[700px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No messages found.
              </div>
            ) : (
              messages.map((message) => (
                <button
                  key={message.id}
                  onClick={() =>
                    setSelected(message)
                  }
                  className={`w-full text-left p-4 border-b hover:bg-gray-50 transition ${
                    selected?.id === message.id
                      ? "bg-blue-50"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">
                      {message.name}
                    </h3>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getBadge(
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
              ))
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border">
          {!selected ? (
            <div className="h-full flex items-center justify-center text-gray-500 p-12">
              Select a message to view details
            </div>
          ) : (
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
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
                  onClick={() =>
                    handleDelete(selected.id)
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} />
                  <span>{selected.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={18} />
                  <span>{selected.email}</span>
                </div>

                {selected.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={18} />
                    <span>{selected.phone}</span>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <p className="whitespace-pre-line text-gray-700">
                  {selected.message}
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() =>
                    handleMarkRead(selected.id)
                  }
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Eye size={18} />
                  Mark Read
                </button>

                <button
                  onClick={() =>
                    handleMarkResponded(selected.id)
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
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