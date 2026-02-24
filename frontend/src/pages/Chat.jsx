import { useEffect, useState, useContext, useRef } from "react";
import { io } from "socket.io-client";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { FiMessageSquare } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

let socket;

function Chat() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [onlineUserIds, setOnlineUserIds] = useState([]);

  const messagesEndRef = useRef(null);

  // ================= SOCKET =================
  useEffect(() => {
    socket = io("http://localhost:5000", {
      withCredentials: true,
    });

    socket.emit("join", user._id);

    socket.on("onlineUsers", (users) => {
      setOnlineUserIds(users);
    });

    socket.on("newMessage", (message) => {
      setUsers((prevUsers) => {
        const updated = [...prevUsers];
        const index = updated.findIndex(
          (u) => u._id === message.senderId
        );
        if (index !== -1) {
          const movedUser = updated.splice(index, 1)[0];
          updated.unshift(movedUser);
        }
        return updated;
      });

      if (!conversation || message.conversationId !== conversation._id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.senderId]:
            (prev[message.senderId] || 0) + 1,
        }));
      } else {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("messagesSeen", ({ conversationId }) => {
      if (conversation && conversation._id === conversationId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === user._id
              ? { ...msg, seen: true }
              : msg
          )
        );
      }
    });

    return () => socket.disconnect();
  }, [user, conversation]);

  // ================= FETCH USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await api.get("/users");
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  // ================= SORT + SEARCH =================
  const sortedUsers = [...users].sort((a, b) => {
    const aOnline = onlineUserIds.includes(a._id);
    const bOnline = onlineUserIds.includes(b._id);
    if (aOnline === bOnline) return 0;
    return aOnline ? -1 : 1;
  });

  const filteredUsers = sortedUsers.filter((u) =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ================= OPEN CHAT =================
  const openChat = async (u) => {
    setSelectedUser(u);

    const convRes = await api.post("/conversations", {
      receiverId: u._id,
    });

    setConversation(convRes.data);

    const msgRes = await api.get(
      `/messages/${convRes.data._id}`
    );
    setMessages(msgRes.data);

    await api.put("/messages/seen", {
      conversationId: convRes.data._id,
      senderId: u._id,
    });

    setUnreadCounts((prev) => ({
      ...prev,
      [u._id]: 0,
    }));
  };

  // ================= SEND MESSAGE =================
  const handleSend = async () => {
    if (!text.trim() || !conversation) return;

    const res = await api.post("/messages", {
      conversationId: conversation._id,
      receiverId: selectedUser._id,
      text,
    });

    setMessages((prev) => [...prev, res.data]);
    setText("");
  };

  // ================= ENTER / SHIFT+ENTER =================
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ================= AUTO SCROLL =================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#0E0B1F] text-white">

      {/* LEFT SIDEBAR */}
      <div className="w-[70px] bg-[#15122B] flex flex-col items-center py-6 gap-6 border-r border-[#1F1B3A]">
        <div
          onClick={() => navigate("/chat")}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center cursor-pointer"
        >
          <FiMessageSquare />
        </div>
      </div>

      {/* USERS SIDEBAR */}
      <div className="w-[320px] bg-[#14112A] border-r border-[#1F1B3A] flex flex-col">

        <div className="p-6 text-xl font-semibold">Users</div>

        <div className="px-4 pb-3">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#1E1A38] outline-none text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 space-y-2 hide-scrollbar">
          {filteredUsers.map((u) => {
            const isOnline = onlineUserIds.includes(u._id);

            return (
              <div
                key={u._id}
                onClick={() => openChat(u)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition
                  ${selectedUser?._id === u._id
                    ? "bg-[#1E1A38]"
                    : "hover:bg-[#1E1A38]"}`}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  {u.fullName[0]}
                </div>

                <div className="flex-1">
                  <p className="font-medium">{u.fullName}</p>
                  <p className="text-sm text-gray-400">
                    {isOnline ? "Active now" : "Offline"}
                  </p>
                </div>

                {unreadCounts[u._id] > 0 && (
                  <div className="bg-indigo-600 text-xs px-2 py-1 rounded-full">
                    {unreadCounts[u._id]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col bg-[#0F0C29]">
        {selectedUser ? (
          <>
            <div className="flex items-center px-8 py-5 border-b border-[#1F1B3A]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  {selectedUser.fullName[0]}
                </div>
                <div>
                  <p className="font-semibold">{selectedUser.fullName}</p>
                  <p className="text-green-400 text-sm">
                    {onlineUserIds.includes(selectedUser._id)
                      ? "Active now"
                      : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 px-16 py-6 overflow-y-auto hide-scrollbar flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap
                    ${msg.senderId === user._id
                      ? "self-end bg-gradient-to-r from-indigo-600 to-purple-600"
                      : "self-start bg-[#2A244F]"}`}
                  style={{
                    maxWidth: "60%",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  <div className="flex items-end gap-2">
                    <span>{msg.text}</span>
                    {msg.senderId === user._id && (
                      <span className="text-xs opacity-80">
                        {msg.seen ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>

            <div className="px-8 py-5 border-t border-[#1F1B3A] flex items-end gap-4 bg-[#14112A]">
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height =
                    e.target.scrollHeight + "px";
                }}
                placeholder="Type a message..."
                onKeyDown={handleKeyDown}
                className="flex-1 bg-[#1E1A38] px-4 py-3 rounded-xl outline-none resize-none overflow-hidden max-h-40"
                rows={1}
              />

              <button
                onClick={handleSend}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center"
              >
                <IoSend />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;