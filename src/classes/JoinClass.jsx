import { useEffect, useState } from "react";
import {
  query,
  collection,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";

import { db, auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/dashboard/sidebar";
import Header from "../components/dashboard/Header";

const JoinClass = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [classes, setClasses] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch classes user is in to display in sidebar
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "classrooms"),
      where("memberIds", "array-contains", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const classList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClasses(classList);
    });

    return () => unsubscribe();
  }, []);

  
  const handleJoin = async () => {
    if (!code.trim()) {
      setMessage("Please enter a valid join code.");
      return;
    }

    // Query by joinCode field
    const q = query(
      collection(db, "classrooms"),
      where("joinCode", "==", code.trim())
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setMessage("❌ Class not found.");
      return;
    }

    const classDoc = querySnapshot.docs[0]; // assuming unique joinCode
    const classData = classDoc.data();
    const classId = classDoc.id;

    if (classData.memberIds.includes(auth.currentUser.uid)) {
      setMessage("⚠️ You are already a member of this class.");
      navigate(`/class/${classId}`);
      return;
    }

    // Update class to add this user
    await updateDoc(classDoc.ref, {
      memberIds: arrayUnion(auth.currentUser.uid),
    });

    setMessage("✅ Successfully joined class!");
    navigate(`/class/${classId}`);
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with slide animation */}
      <div
        className={`fixed z-50 h-full bg-gray-900 transition-transform duration-300 ease-in-out w-64 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar userClasses={classes} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <Header onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

        <div className="max-w-3xl m-5 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Join a Class</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Join Code
              </label>
              <input
                placeholder="Enter Class Code"
                className="mb-2 w-full border px-4 py-2 rounded"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                onClick={handleJoin}
                className="bg-purple-700 text-white px-4 py-2 rounded"
              >
                Join Class
              </button>
            </div>
          </div>

          <p className="text-sm mt-2 text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default JoinClass;
