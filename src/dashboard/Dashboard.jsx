// import { useEffect, useState } from "react";
// import { db, auth } from "../services/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   doc,
//   getDoc,
// } from "firebase/firestore";
// import Sidebar from "../components/dashboard/sidebar";
// import Header from "../components/dashboard/Header";
// import { Link } from "react-router-dom";

// const Dashboard = () => {
//   const [classes, setClasses] = useState([]);
//   const [user, setUser] = useState(null);
//   const [isSidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
//       if (!authUser) return console.log("User not logged in.");

//       // Get user details
//       const userRef = doc(db, "users", authUser.uid);
//       const userSnap = await getDoc(userRef);
//       if (userSnap.exists()) {
//         setUser(userSnap.data());
//       }

//       // Fetch classrooms where this user is a member
//       const q = query(
//         collection(db, "classrooms"),
//         where("memberIds", "array-contains", authUser.uid)
//       );

//       const unsubscribeClasses = onSnapshot(q, (snapshot) => {
//         const result = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setClasses(result);
//       });

//       // Cleanup class subscription on unmount
//       return () => unsubscribeClasses();
//     });

//     return () => unsubscribeAuth();
//   }, []);

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar with slide animation */}
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

//         <div className="max-w-7xl mx-auto p-6">
//           <div className="mb-6">
//             <h1 className="text-3xl font-bold  text-gray-800">
//               Welcome back,{" "}
//               <span className="capitalize">{user?.displayName || "User"}</span>!
//             </h1>
//             <p className="text-gray-500 mt-1">
//               Here's what's happening in your Classmate.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <h3 className="text-lg font-semibold mb-2">Create a New Class</h3>
//               <p className="text-sm text-gray-500 mb-4">
//                 Start a new virtual classroom and invite members.
//               </p>
//               <Link
//                 to="/create-class"
//                 className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 inline-block"
//               >
//                 Create Class
//               </Link>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <h3 className="text-lg font-semibold mb-2">
//                 Join an Existing Class
//               </h3>
//               <p className="text-sm text-gray-500 mb-4">
//                 Enter a join code to become part of a class.
//               </p>
//               <Link
//                 to="/join-class"
//                 className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 inline-block"
//               >
//                 Join Class
//               </Link>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <h3 className="text-lg font-semibold mb-2">
//                 Classmate AI Assistant
//               </h3>
//               <p className="text-sm text-gray-500 mb-4">
//                 Get AI-powered teaching suggestions and answers instantly.
//               </p>
//               <Link
//                 to="/ai-assistant"
//                 className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block"
//               >
//                 Go to AI Assistant
//               </Link>
//             </div>
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold mb-4">My Classes</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {classes.map((cls) => (
//                 <Link
//                   to={`/class/${cls.id}`}
//                   key={cls.id}
//                   className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-200"
//                 >
//                   <div className="bg-gray-200 h-40 flex items-center justify-center text-gray-500 text-xl">
//                     600 × 300
//                   </div>
//                   <div className="p-4">
//                     <h3 className="font-semibold text-lg capitalize">
//                       {cls.name}
//                     </h3>
//                     <p className="text-sm text-gray-500">
//                       {cls.memberIds?.length || 0} Members
//                     </p>
//                   </div>
//                 </Link>
//               ))}

//               {classes.length === 0 && (
//                 <p className="text-gray-500 text-sm col-span-full">
//                   You haven't joined or created any classes yet.
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


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
      <div className="flex-1 overflow-y-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Create a New Class</h3>
              <p className="text-sm text-gray-500 mb-4">
                Start a new virtual classroom and invite members.
              </p>
              <Link
                to="/create-class"
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 inline-block"
              >
                Create Class
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">
                Join an Existing Class
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Enter a join code to become part of a class.
              </p>
              <Link
                to="/join-class"
                className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 inline-block"
              >
                Join Class
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">
                Classmate AI Assistant
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Get AI-powered teaching suggestions and answers instantly.
              </p>
              <Link
                to="/ai-assistant"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block"
              >
                Go to AI Assistant
              </Link>
            </div>
          </div>

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
