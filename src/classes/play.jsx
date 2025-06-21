import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../services/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  deleteDoc,
  where,
} from "firebase/firestore";
import {
  Video,
  MoreVertical,
  Copy,
  Paperclip,
  Send,
  Users,
  Hash,
} from "lucide-react";
import Sidebar from "../components/dashboard/sidebar";
import Header from "../components/dashboard/Header";

const ClassChat = () => {
  const { id: classId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [classes, setClasses] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);

  // Fetch class info
  useEffect(() => {
    const fetchClassInfo = async () => {
      const classRef = doc(db, "classrooms", classId);
      const snap = await getDoc(classRef);
      if (snap.exists()) setClassInfo(snap.data());
    };
    fetchClassInfo();
  }, [classId]);

  // Fetch user's classes for sidebar
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;
      const q = query(
        collection(db, "classrooms"),
        where("memberIds", "array-contains", user.uid)
      );
      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const classList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClasses(classList);
      });
      return unsubscribeSnapshot;
    });
    return () => unsubscribeAuth();
  }, []);

  // Listen to messages
  useEffect(() => {
    const q = query(
      collection(db, "classrooms", classId, "messages"),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsubscribe();
  }, [classId]);

  useEffect(() => {
    const checkAccess = async () => {
      const unsubscribeAuth = auth.onAuthStateChanged((user) => {
        if (!user) {
          alert("Please login to continue");
          return navigate("/login");
        }
      });

      const classRef = doc(db, "classrooms", classId);
      const snap = await getDoc(classRef);

      if (!snap.exists()) {
        // Invalid Class ID
        return navigate("*");
      }

      const data = snap.data();
      setClassInfo(data);

      if (data.memberIds.includes(auth.currentUser.uid)) {
        setIsMember(true);
      } else {
        const join = window.prompt(
          `You are not a member of this class: ${data.name}\n\nDescription: ${data.description}\nMembers: ${data.memberIds.length}\n\nTo join, please enter the class join code:`
        );

        if (join === data.joinCode) {
          await updateDoc(classRef, {
            memberIds: [...data.memberIds, auth.currentUser.uid],
          });
          setIsMember(true);
          alert("Successfully joined the class!");
        } else {
          alert("Incorrect join code. Redirecting to login.");
          return navigate("/login");
        }
      }

      setLoading(false);
    };

    checkAccess();
  }, [classId, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!isMember) return null; // Prevent UI flicker while checking

  const sendMessage = async () => {
    if (!message.trim()) return;
    await addDoc(collection(db, "classrooms", classId, "messages"), {
      text: message,
      sender: auth.currentUser.email,
      createdAt: serverTimestamp(),
    });
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startGoogleMeet = () => {
    const meetLink = `https://meet.google.com/new`;
    window.open(meetLink, "_blank");
  };

  const handleExitClass = async () => {
    setLoading(true);
    const classRef = doc(db, "classrooms", classId);
    try {
      await updateDoc(classRef, {
        memberIds: arrayRemove(auth.currentUser.uid),
      });
      setShowExitModal(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error exiting class:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async () => {
    setLoading(true);
    const classRef = doc(db, "classrooms", classId);
    try {
      await deleteDoc(classRef);
      setShowDeleteModal(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting class:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const isOwner = auth.currentUser?.uid === classInfo?.ownerId;

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`fixed z-50 h-full bg-gray-900 transition-transform duration-300 ease-in-out w-64 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar userClasses={classes} onClose={() => setSidebarOpen(false)} />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-auto">
        <Header onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

        <div className="flex-1 flex flex-col p-4 space-y-4">
          {classInfo && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                    {classInfo.name}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{classInfo.memberIds.length} members</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Join Code:</span>
                      <code className="ml-1 px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                        {classInfo.joinCode}
                      </code>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={startGoogleMeet}
                    className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
                  >
                    <Video className="mr-2 w-5 h-5" />
                    Start Call
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 top-12 bg-white border border-gray-200 shadow-lg rounded-lg w-48 z-10 py-1">
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                          onClick={() => {
                            setShowInviteModal(true);
                            setShowDropdown(false);
                          }}
                        >
                          Invite Students
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                          onClick={() => {
                            setShowExitModal(true);
                            setShowDropdown(false);
                          }}
                        >
                          Exit Class
                        </button>
                        {isOwner && (
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                            onClick={() => {
                              setShowDeleteModal(true);
                              setShowDropdown(false);
                            }}
                          >
                            Delete Class
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            {/* Chat header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Hash className="w-5 h-5 mr-2 text-gray-500" />
                Class Discussion
              </h3>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-scroll p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Hash className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">
                    No messages yet
                  </p>
                  <p className="text-gray-400 text-sm">
                    Start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMine = msg.sender === auth.currentUser?.email;

                  return (
                    <div
                      key={i}
                      className={`flex ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md ${
                          isMine ? "order-2" : "order-1"
                        }`}
                      >
                        {/* Sender info */}
                        <div
                          className={`flex items-center space-x-2 mb-1 ${
                            isMine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              isMine
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {(msg.sender || "").charAt(0).toUpperCase()}
                          </div>
                          <div
                            className={`flex items-center space-x-2 ${
                              isMine ? "flex-row-reverse space-x-reverse" : ""
                            }`}
                          >
                            <span className="text-sm font-medium text-gray-900">
                              {isMine
                                ? "You"
                                : (msg.sender || "").split("@")[0]}
                            </span>
                            {msg.createdAt && (
                              <span className="text-xs text-gray-500">
                                {formatTime(msg.createdAt)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Message bubble */}
                        <div
                          className={`p-3 rounded-2xl ${
                            isMine
                              ? "bg-blue-600 text-white rounded-br-md"
                              : "bg-gray-100 text-gray-900 rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm leading-relaxed break-words">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message input */}
            <div className="border-t border-gray-100 p-4 bg-gray-50 rounded-b-xl">
              <div className="flex items-end space-x-3">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    rows="1"
                    style={{
                      minHeight: "44px",
                      maxHeight: "120px",
                    }}
                  />
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className={`p-3 rounded-xl transition-all ${
                    message.trim()
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Exit Class
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to exit this class?
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExitClass}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={loading}
              >
                {loading ? "Processing..." : "Yes, Exit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal (Only Owner) */}
      {showDeleteModal && isOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4 text-red-600">
              Delete Class
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this class? This action cannot be
              undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClass}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Invite Students
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Link
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    readOnly
                    value={`${window.location.origin}/class/${classId}`}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${window.location.origin}/class/${classId}`
                      )
                    }
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Join Code
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    readOnly
                    value={classInfo?.joinCode || ""}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(classInfo?.joinCode || "")}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassChat;