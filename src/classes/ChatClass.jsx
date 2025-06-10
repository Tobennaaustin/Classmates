// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db, auth } from "../services/firebase";
// import {
//   collection,
//   addDoc,
//   query,
//   orderBy,
//   onSnapshot,
//   serverTimestamp,
//   doc,
//   getDoc,
//   updateDoc,
//   arrayUnion,
//   where,
// } from "firebase/firestore";
// import { Video } from "lucide-react";
// import Sidebar from "../components/dashboard/sidebar";
// import Header from "../components/dashboard/Header";

// const ClassChat = () => {
//   const { id: classId } = useParams();
//   const navigate = useNavigate();
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [classInfo, setClassInfo] = useState(null);
//   const [classes, setClasses] = useState([]);
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [showJoinModal, setShowJoinModal] = useState(false);
//   const [joinCodeInput, setJoinCodeInput] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchClassInfo = async () => {
//       const classRef = doc(db, "classrooms", classId);
//       const snap = await getDoc(classRef);
//       if (snap.exists()) setClassInfo(snap.data());
//     };
//     fetchClassInfo();
//   }, [classId]);

//   // Check membership
//   useEffect(() => {
//     const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
//       if (!user) {
//         navigate("/login");
//         return;
//       }

//       const q = query(
//         collection(db, "classrooms"),
//         where("memberIds", "array-contains", user.uid)
//       );

//       const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
//         const userClasses = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setClasses(userClasses);

//         const isMember = userClasses.some((cls) => cls.id === classId);
//         if (!isMember) {
//           setShowJoinModal(true);
//         }
//       });

//       return unsubscribeSnapshot;
//     });

//     return () => unsubscribeAuth();
//   }, [classId, navigate]);

//   // Listen to messages
//   useEffect(() => {
//     const q = query(
//       collection(db, "classrooms", classId, "messages"),
//       orderBy("createdAt")
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       setMessages(snapshot.docs.map((doc) => doc.data()));
//     });

//     return () => unsubscribe();
//   }, [classId]);

//   const sendMessage = async () => {
//     if (!message.trim()) return;

//     await addDoc(collection(db, "classrooms", classId, "messages"), {
//       text: message,
//       sender: auth.currentUser.email,
//       createdAt: serverTimestamp(),
//     });

//     setMessage("");
//   };

//   const handleJoinClass = async () => {
//     if (!auth.currentUser) return navigate("/login");

//     if (joinCodeInput === classInfo.joinCode) {
//       // Correct join code
//       const classRef = doc(db, "classrooms", classId);
//       await updateDoc(classRef, {
//         memberIds: arrayUnion(auth.currentUser.uid),
//       });

//       setShowJoinModal(false);
//       setError("");
//       alert("You have successfully joined the class!");
//     } else {
//       setError("Invalid join code. Redirecting to login...");
//       setTimeout(() => navigate("/login"), 2000);
//     }
//   };

//   const startGoogleMeet = () => {
//     window.open(`https://meet.google.com/new`, "_blank");
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div
//         className={`fixed z-50 h-full bg-gray-900 transition-transform duration-300 ease-in-out w-64 md:relative md:translate-x-0 ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <Sidebar userClasses={classes} onClose={() => setSidebarOpen(false)} />
//       </div>

//       {/* Overlay */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <div className="flex-1 overflow-y-auto">
//         <Header onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

//         {showJoinModal && (
//           <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
//             <div className="bg-white p-6 rounded shadow w-96 text-center">
//               <h2 className="text-xl font-semibold mb-4">Enter Join Code</h2>
//               <input
//                 type="text"
//                 placeholder="Class Join Code"
//                 value={joinCodeInput}
//                 onChange={(e) => setJoinCodeInput(e.target.value)}
//                 className="w-full border px-4 py-2 mb-4 rounded"
//               />
//               {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//               <button
//                 onClick={handleJoinClass}
//                 className="bg-teal-600 text-white px-4 py-2 rounded mr-2"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="p-4 h-screen flex flex-col">
//           {/* Class Info */}
//           {classInfo && (
//             <div className="flex p-6 rounded-lg justify-between items-center">
//               <div>
//                 <h2 className="text-2xl font-bold capitalize mb-3 color">
//                   {classInfo.name}
//                 </h2>
//                 <p className="text-sm text-gray-600">
//                   <strong>Join Code:</strong> {classInfo.joinCode} <br />
//                   <strong>Members:</strong> {classInfo.memberIds.length}
//                 </p>
//               </div>
//               <button
//                 onClick={startGoogleMeet}
//                 className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
//               >
//                 <Video className="mr-2 w-5 h-5" />
//                 Call
//               </button>
//             </div>
//           )}

//           <div className="border-b border-gray-300 mb-4"></div>

//           {/* Chat */}
//           <div className="bg-white p-4 rounded shadow flex-1 flex flex-col overflow-hidden">
//             <h3 className="text-lg font-semibold mb-2">Class Chat</h3>
//             <div className="flex-1 overflow-y-auto space-y-2 mb-4">
//               {messages.map((msg, i) => {
//                 const isMine = msg.sender === auth.currentUser.email;
//                 return (
//                   <div
//                     key={i}
//                     className={`flex ${
//                       isMine ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     <div
//                       className={`p-3 rounded-lg max-w-xs break-words ${
//                         isMine
//                           ? "bg-color text-white rounded-br-none"
//                           : "bg-gray-200 text-gray-800 rounded-bl-none"
//                       }`}
//                     >
//                       <p className="text-xs mb-1">
//                         {isMine ? "You" : msg.sender}
//                       </p>
//                       <p>{msg.text}</p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* <div className="p-4 border-t flex items-center gap-2 bg-gray-100 rounded-b-lg">
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type a message..."
//                 className="flex-1 border px-4 py-2 rounded-l"
//               />
//               <button
//                 onClick={sendMessage}
//                 className="bg-color text-white px-4 py-2 rounded-r"
//               >
//                 Send
//               </button>
//             </div> */}
//             <div className="p-4 border-t-gray-200 border-gray-200 flex items-center gap-2 bg-gray-100 rounded-b-lg overflow-hidden">
//               <button
//                 className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent h-10 w-10 text-muted-foreground hover:text-primary"
//                 type="button"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   stroke-width="2"
//                   stroke-linecap="round"
//                   stroke-linejoin="round"
//                   class="lucide lucide-paperclip h-5 w-5"
//                 >
//                   <path d="M13.234 20.252 21 12.3"></path>
//                   <path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"></path>
//                 </svg>
//                 <span class="sr-only">Attach file</span>
//               </button>
//               <input
//                 class="flex h-10 w-full rounded-md  border-gray-200 border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground md:text-sm flex-grow"
//                 placeholder="Type a message..."
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//               />
//               <button
//                 className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-color text-primary-foreground hover:bg-primary/90 h-10 w-10"
//                 type="submit"
//                 disabled=""
//                 onClick={sendMessage}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   stroke-width="2"
//                   stroke-linecap="round"
//                   stroke-linejoin="round"
//                   class="lucide lucide-send h-5 w-5 text-white"
//                 >
//                   <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
//                   <path d="m21.854 2.147-10.94 10.939"></path>
//                 </svg>
//                 <span class="sr-only">Send message</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClassChat;


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
import { Video, MoreVertical, Copy } from "lucide-react";
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

  const sendMessage = async () => {
    if (!message.trim()) return;
    await addDoc(collection(db, "classrooms", classId, "messages"), {
      text: message,
      sender: auth.currentUser.email,
      createdAt: serverTimestamp(),
    });
    setMessage("");
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

  const isOwner = auth.currentUser?.uid === classInfo?.ownerId;

  return (
    <div className="flex h-screen bg-gray-100">
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
              <div>
                <h2 className="text-2xl font-bold capitalize mb-3 color">
                  {classInfo.name}
                </h2>
                <p className="text-sm text-gray-600">
                  <strong>Join Code:</strong> {classInfo.joinCode} <br />
                  <strong>Members:</strong> {classInfo.memberIds.length}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={startGoogleMeet}
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
                >
                  <Video className="mr-2 w-5 h-5" /> Call
                </button>
                <div className="relative">
                  <button onClick={() => setShowDropdown(!showDropdown)}>
                    <MoreVertical className="w-6 h-6 cursor-pointer" />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-200 shadow rounded w-48 z-10">
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowExitModal(true)}
                      >
                        Exit Class
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowInviteModal(true)}
                      >
                        Invite Students
                      </button>
                      {isOwner && (
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                          onClick={() => setShowDeleteModal(true)}
                        >
                          Delete Class
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="border-b border-gray-300 mb-4"></div>

          <div className="bg-white p-4 rounded shadow flex-1 flex flex-col overflow-hidden">
            <h3 className="text-lg font-semibold mb-2">Class Chat</h3>
            <div className="border-b border-gray-300 mb-4"></div>
            <div className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-thin scrollbar-thumb-gray-300">
              {messages.length === 0 && (
                <p className="text-sm text-gray-500 text-center mt-10">
                  No messages yet.
                </p>
              )}

              {messages.map((msg, i) => {
                const isMine = msg.sender === auth.currentUser.email;
                return (
                  <div
                    key={i}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-xs break-words ${
                        isMine
                          ? "bg-color text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="text-xs mb-1">
                        {isMine ? "You" : msg.sender}
                      </p>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* <div className="p-4 border-t-gray-200 border-gray-200 flex items-center gap-2 bg-gray-100 rounded-b-lg overflow-hidden">
              <input
                className="flex h-10 w-full rounded-md border-gray-200 border px-3 py-2 text-base flex-grow"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                onClick={sendMessage}
                className="bg-color text-white rounded-md px-4 py-2 hover:bg-primary/90"
              >
                Send
              </button>
            </div> */}
            <div className="p-4 border-t-gray-200 border-gray-200 flex items-center gap-2 bg-gray-100 rounded-b-lg overflow-hidden">
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent h-10 w-10 text-muted-foreground hover:text-primary"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-paperclip h-5 w-5"
                >
                  <path d="M13.234 20.252 21 12.3"></path>
                  <path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"></path>
                </svg>
                <span class="sr-only">Attach file</span>
              </button>
              <input
                class="flex h-10 w-full rounded-md  border-gray-200 border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground md:text-sm flex-grow"
                placeholder="Type a message..."
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-color text-primary-foreground hover:bg-primary/90 h-10 w-10"
                type="submit"
                disabled=""
                onClick={sendMessage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-send h-5 w-5 text-white"
                >
                  <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                  <path d="m21.854 2.147-10.94 10.939"></path>
                </svg>
                <span class="sr-only">Send message</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow">
            <p className="mb-4">Are you sure you want to exit this class?</p>
            <div className="flex gap-4">
              <button
                onClick={handleExitClass}
                className="bg-red-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Processing..." : "Yes, Exit"}
              </button>
              <button
                onClick={() => setShowExitModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal (Only Owner) */}
      {showDeleteModal && isOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow">
            <p className="mb-4 text-red-600">
              Are you sure you want to delete this class? This action cannot be
              undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteClass}
                className="bg-red-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm">
            <h3 className="font-semibold mb-2">Invite Students</h3>
            <p className="mb-2">
              <strong>Class Link:</strong> {window.location.origin}/class/
              {classId}
            </p>
            <button
              onClick={() =>
                copyToClipboard(`${window.location.origin}/class/${classId}`)
              }
              className="flex items-center gap-1 text-blue-600 mb-2"
            >
              <Copy size={16} /> Copy Link
            </button>
            <p className="mb-2">
              <strong>Join Code:</strong> {classInfo?.joinCode}
            </p>
            <button
              onClick={() => copyToClipboard(classInfo?.joinCode)}
              className="flex items-center gap-1 text-blue-600 mb-4"
            >
              <Copy size={16} /> Copy Code
            </button>
            <button
              onClick={() => setShowInviteModal(false)}
              className="bg-gray-300 px-4 py-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassChat;
