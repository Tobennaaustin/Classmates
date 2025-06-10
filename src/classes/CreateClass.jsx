import { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import Sidebar from "../components/dashboard/sidebar";
import Header from "../components/dashboard/Header";

const generateJoinCode = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const CreateClass = () => {
  const [className, setClassName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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

  const handleCreate = async () => {
    if (!className.trim()) return alert("Class name is required.");

    setLoading(true);
    try {
      const joinCode = generateJoinCode();
      const ownerId = auth.currentUser.uid;

      // Create a document with generated ID as class code
      const classRef = doc(collection(db, "classrooms"));

      await setDoc(classRef, {
        name: className.trim(),
        description: description.trim(),
        createdAt: serverTimestamp(),
        ownerId: ownerId,
        joinCode: joinCode,
        memberIds: [ownerId],
      });

      alert(`✅ Class created successfully!\nJoin code: ${joinCode}`);
      setClassName("");
      setDescription("");
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
    setLoading(false);
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

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 overflow-y-auto">
        <Header onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

        <div className="max-w-3xl m-5 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Create a New Class</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Name
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. CSC 305"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Brief description of the class"
              />
            </div>

            <button
              onClick={handleCreate}
              disabled={loading}
              className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Class"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClass;
