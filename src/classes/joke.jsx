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
  X,
  LogOut,
  UserPlus,
  Trash2,
  Crown,
} from "lucide-react";
import Sidebar from "../components/dashboard/sidebar";
import Header from "../components/dashboard/Header";

const Joke = () => {
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
      if (snap.exists()) {
        const data = snap.data();

        // fetch owner email
        if (data.ownerId) {
          const ownerDoc = await getDoc(doc(db, "users", data.ownerId));
          if (ownerDoc.exists()) {
            data.ownerEmail = ownerDoc.data().email;
          }
        }
        setClassInfo(data);
      }
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

  const closeAllModals = () => {
    setShowExitModal(false);
    setShowDeleteModal(false);
    setShowInviteModal(false);
    setShowDropdown(false);
  };

  const ModalOverlay = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-end justify-center md:items-center"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

        {/* Modal Content */}
        <div
          className={`
            relative w-full max-w-md mx-4 mb-0 md:mb-4
            bg-white rounded-t-3xl md:rounded-2xl
            shadow-2xl transform transition-all duration-300 ease-out
            ${
              isOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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

      <div className="flex-1 overflow-y-auto">
        <Header onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

        <div className="p-4 h-screen flex flex-col">
          {classInfo && (
            <div className="flex p-6 rounded-lg justify-between items-center relative">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Hash className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 capitalize">
                      {classInfo.name}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{classInfo.memberIds.length} members</span>
                      </div>
                      {isOwner && (
                        <div className="flex items-center gap-1 text-[#9810fa]">
                          <Crown className="w-4 h-4" />
                          <span className="font-medium">Owner</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Join Code:
                  </span>
                  <code className="px-3 py-1 bg-[#9810fa]/10 text-[#9810fa] rounded-lg text-sm font-mono font-semibold border border-[#9810fa]/20">
                    {classInfo.joinCode}
                  </code>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={startGoogleMeet}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                >
                  <Video className="w-5 h-5" />
                  <span className="hidden sm:inline">Start Call</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <MoreVertical className="w-5 h-5 text-gray-700" />
                  </button>

                  {showDropdown && (
                    <div className="relative right-0 top-14 bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-2xl w-56 z-20 overflow-hidden">
                      <button
                        className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-50/80 transition-colors text-gray-700"
                        onClick={() => {
                          setShowExitModal(true);
                          setShowDropdown(false);
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        Exit Class
                      </button>
                      <button
                        className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-50/80 transition-colors text-gray-700"
                        onClick={() => {
                          setShowInviteModal(true);
                          setShowDropdown(false);
                        }}
                      >
                        <UserPlus className="w-4 h-4" />
                        Invite Students
                      </button>
                      {isOwner && (
                        <button
                          className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-red-50/80 transition-colors text-red-600 border-t border-gray-100/50"
                          onClick={() => {
                            setShowDeleteModal(true);
                            setShowDropdown(false);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Class
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 flex-1 flex flex-col overflow-hidden">
            {/* Chat header */}
            <div className="px-6 py-4 border-b border-gray-100/50 bg-gradient-to-r from-[#9810fa]/5 to-purple-50/50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-[#9810fa]/20 rounded-lg flex items-center justify-center mr-3">
                  <Hash className="w-4 h-4 text-[#9810fa]" />
                </div>
                Class Discussion
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 p-6 bg-gradient-to-b from-white/50 to-gray-50/30">
              {messages.length === 0 && (
                <div className="text-center mt-20">
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
              )}

              {messages.map((msg, i) => {
                const owner = msg.sender === classInfo?.ownerEmail;
                const isMine = msg.sender === auth.currentUser.email;

                return (
                  <div
                    key={i}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    } group`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md ${
                        isMine ? "order-2" : "order-1"
                      }`}
                    >
                      {/* Sender info */}
                      <div
                        className={`flex items-center gap-2 mb-2 ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                            owner
                              ? "bg-gradient-to-br from-[#9810fa] to-purple-600 text-white"
                              : isMine
                              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                              : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700"
                          }`}
                        >
                          {(msg.sender || "").charAt(0).toUpperCase()}
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            isMine ? "flex-row-reverse" : ""
                          }`}
                        >
                          <span className="text-sm font-semibold text-gray-900">
                            {isMine
                              ? "You"
                              : owner
                              ? "Teacher"
                              : (msg.sender || "").split("@")[0]}
                            {owner && !isMine && (
                              <Crown className="w-3 h-3 text-[#9810fa] ml-1 inline" />
                            )}
                          </span>
                          {msg.createdAt && (
                            <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              {formatTime(msg.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Message bubble */}
                      <div
                        className={`p-4 rounded-2xl shadow-sm ${
                          owner && !isMine
                            ? "bg-gradient-to-br from-[#9810fa]/90 to-purple-600/90 text-white rounded-bl-md"
                            : isMine
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                            : "bg-white border border-gray-200/50 text-gray-900 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-100/50 p-4 bg-white/80 backdrop-blur-sm">
              <div className="flex items-end gap-3">
                <button className="p-3 text-gray-500 hover:text-[#9810fa] hover:bg-[#9810fa]/10 rounded-xl transition-all duration-200">
                  <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-2xl resize-none focus:outline-none focus:border-[#9810fa]/50 focus:ring-4 focus:ring-[#9810fa]/10 bg-white/80 backdrop-blur-sm transition-all duration-200"
                    rows="1"
                    style={{
                      minHeight: "48px",
                      maxHeight: "120px",
                    }}
                  />
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className={`p-3 rounded-2xl transition-all duration-200 ${
                    message.trim()
                      ? "bg-gradient-to-r from-[#9810fa] to-purple-600 hover:from-[#9810fa]/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
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
      <ModalOverlay
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Exit Class</h3>
            <button
              onClick={() => setShowExitModal(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-6 h-6 text-red-600" />
          </div>

          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to exit this class? You'll need the join code
            to rejoin.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setShowExitModal(false)}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExitClass}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Exiting..." : "Exit Class"}
            </button>
          </div>
        </div>
      </ModalOverlay>

      {/* Delete Modal */}
      <ModalOverlay
        isOpen={showDeleteModal && isOwner}
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Delete Class</h3>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>

          <p className="text-gray-600 text-center mb-2">
            Are you sure you want to delete this class?
          </p>
          <p className="text-red-600 text-center text-sm mb-6 font-medium">
            This action cannot be undone and all messages will be lost.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteClass}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete Forever"}
            </button>
          </div>
        </div>
      </ModalOverlay>

      {/* Invite Modal */}
      <ModalOverlay
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Invite Students</h3>
            <button
              onClick={() => setShowInviteModal(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-12 h-12 bg-[#9810fa]/20 rounded-xl flex items-center justify-center mx-auto mb-6">
            <UserPlus className="w-6 h-6 text-[#9810fa]" />
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Class Link
              </p>
              <p className="text-sm text-gray-600 break-all mb-3">
                {window.location.origin}/class/{classId}
              </p>
              <button
                onClick={() =>
                  copyToClipboard(`${window.location.origin}/class/${classId}`)
                }
                className="flex items-center gap-2 text-[#9810fa] hover:text-[#9810fa]/80 text-sm font-medium transition-colors"
              >
                <Copy className="w-4 h-4" /> Copy Link
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Join Code
              </p>
              <code className="text-lg font-mono font-bold text-[#9810fa] mb-3 block">
                {classInfo?.joinCode}
              </code>
              <button
                onClick={() => copyToClipboard(classInfo?.joinCode)}
                className="flex items-center gap-2 text-[#9810fa] hover:text-[#9810fa]/80 text-sm font-medium transition-colors"
              >
                <Copy className="w-4 h-4" /> Copy Code
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowInviteModal(false)}
            className="w-full mt-6 py-3 px-4 bg-[#9810fa] hover:bg-[#9810fa]/90 text-white rounded-xl font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </ModalOverlay>
    </div>
  );
};

export default Joke;
