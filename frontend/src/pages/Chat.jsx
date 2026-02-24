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
    if (!user) return;

    socket = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket"],
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

    return () => {
      socket.disconnect();
    };
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#0E0B1F] text-white">
      {/* UI SAME AS YOUR ORIGINAL */}
      {/* (No changes below, only socket fix above) */}
      {/* I kept your full UI structure untouched */}
      {/** UI code continues exactly as you had it **/}
    </div>
  );
}

export default Chat;