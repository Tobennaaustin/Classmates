import { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import Sidebar from "../components/dashboard/sidebar";
import Header from "../components/dashboard/Header";
import { Link } from "react-router-dom";
import Quickaction from "../components/dashboard/quickaction";

const Dashboard = () => {
  const [classes, setClasses] = useState([]);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) return console.log("User not logged in.");

      const userRef = doc(db, "users", authUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUser(userSnap.data());
      }

      const q = query(
        collection(db, "classrooms"),
        where("memberIds", "array-contains", authUser.uid)
      );

      const unsubscribeClasses = onSnapshot(q, (snapshot) => {
        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClasses(result);
      });

      return () => unsubscribeClasses();
    });

    return () => unsubscribeAuth();
  }, []);

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
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <Header onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold  text-gray-800">
              Welcome back,{" "}
              <span className="capitalize">{user?.displayName || "User"}</span>!
            </h1>
            <p className="text-gray-500 mt-1">
              Here's what's happening in your Classmate.
            </p>
          </div>
          
          <Quickaction />

          <div>
            <h2 className="text-xl font-semibold mb-4">My Classes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {classes.map((cls) => (
                <Link
                  to={`/class/${cls.id}`}
                  key={cls.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-200"
                >
                  <div className="h-40">
                    <img
                      src={
                        cls.imageUrl ||
                        "/dummy.png"
                      }
                      alt="Class Visual"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg capitalize">
                      {cls.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {cls.memberIds?.length || 0} Members
                    </p>
                  </div>
                </Link>
              ))}

              {classes.length === 0 && (
                <p className="text-gray-500 text-sm col-span-full">
                  You haven't joined or created any classes yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
