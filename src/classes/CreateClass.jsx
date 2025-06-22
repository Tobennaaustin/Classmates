// import { useEffect, useState } from "react";
// import { db, auth } from "../services/firebase";
// import {
//   collection,
//   doc,
//   setDoc,
//   serverTimestamp,
//   query,
//   where,
//   onSnapshot,
// } from "firebase/firestore";
// import Sidebar from "../components/dashboard/sidebar";
// import Header from "../components/dashboard/Header";

// const generateJoinCode = () => {
//   const chars =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let code = "";
//   for (let i = 0; i < 6; i++) {
//     code += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return code;
// };

// const CreateClass = () => {
//   const [className, setClassName] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [classes, setClasses] = useState([]);
//   const [isSidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     if (!auth.currentUser) return;

//     const q = query(
//       collection(db, "classrooms"),
//       where("memberIds", "array-contains", auth.currentUser.uid)
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const classList = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setClasses(classList);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleCreate = async () => {
//     if (!className.trim()) return alert("Class name is required.");

//     setLoading(true);
//     try {
//       const joinCode = generateJoinCode();
//       const ownerId = auth.currentUser.uid;

//       // Create a document with generated ID as class code
//       const classRef = doc(collection(db, "classrooms"));

//       await setDoc(classRef, {
//         name: className.trim(),
//         description: description.trim(),
//         createdAt: serverTimestamp(),
//         ownerId: ownerId,
//         joinCode: joinCode,
//         memberIds: [ownerId],
//       });

//       alert(`✅ Class created successfully!\nJoin code: ${joinCode}`);
//       setClassName("");
//       setDescription("");
//     } catch (err) {
//       alert(`❌ ${err.message}`);
//     }
//     setLoading(false);
//   };

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

//         <div className="max-w-3xl m-5 bg-white p-6 rounded-lg shadow">
//           <h2 className="text-2xl font-bold mb-4">Create a New Class</h2>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Class Name
//               </label>
//               <input
//                 type="text"
//                 value={className}
//                 onChange={(e) => setClassName(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
//                 placeholder="e.g. CSC 305"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
//                 placeholder="Brief description of the class"
//               />
//             </div>

//             <button
//               onClick={handleCreate}
//               disabled={loading}
//               className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition disabled:opacity-50"
//             >
//               {loading ? "Creating..." : "Create Class"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateClass;


// import { useEffect, useState } from "react";
// import { db, auth } from "../services/firebase";
// import {
//   collection,
//   doc,
//   setDoc,
//   serverTimestamp,
//   query,
//   where,
//   onSnapshot,
// } from "firebase/firestore";
// import Sidebar from "../components/dashboard/sidebar";
// import Header from "../components/dashboard/Header";

// const generateJoinCode = () => {
//   const chars =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let code = "";
//   for (let i = 0; i < 6; i++) {
//     code += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return code;
// };

// const imageOptions = [
//   "https://via.placeholder.com/600x300?text=Default+Image", // Default mock image
//   "https://img.freepik.com/free-vector/online-class-concept-illustration_114360-5347.jpg",
//   "https://img.freepik.com/free-vector/online-learning-illustration_53876-9350.jpg",
//   "https://img.freepik.com/free-vector/college-illustration-concept_114360-8727.jpg",
// ];

// const CreateClass = () => {
//   const [className, setClassName] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [classes, setClasses] = useState([]);
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [useImage, setUseImage] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(imageOptions[0]);

//   useEffect(() => {
//     if (!auth.currentUser) return;

//     const q = query(
//       collection(db, "classrooms"),
//       where("memberIds", "array-contains", auth.currentUser.uid)
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const classList = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setClasses(classList);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleCreate = async () => {
//     if (!className.trim()) return alert("Class name is required.");

//     setLoading(true);
//     try {
//       const joinCode = generateJoinCode();
//       const ownerId = auth.currentUser.uid;

//       const classRef = doc(collection(db, "classrooms"));

//       await setDoc(classRef, {
//         name: className.trim(),
//         description: description.trim(),
//         createdAt: serverTimestamp(),
//         ownerId: ownerId,
//         joinCode: joinCode,
//         memberIds: [ownerId],
//         imageUrl: useImage
//           ? selectedImage
//           : "https://via.placeholder.com/600x300?text=Default+Image",
//       });

//       alert(`✅ Class created successfully!\nJoin code: ${joinCode}`);
//       setClassName("");
//       setDescription("");
//       setUseImage(false);
//       setSelectedImage(imageOptions[0]);
//     } catch (err) {
//       alert(`❌ ${err.message}`);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <div
//         className={`fixed z-50 h-full bg-gray-900 transition-transform duration-300 ease-in-out w-64 md:relative md:translate-x-0 ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <Sidebar userClasses={classes} onClose={() => setSidebarOpen(false)} />
//       </div>

//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//       <div className="flex-1 overflow-y-auto">
//         <Header onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

//         <div className="max-w-3xl m-5 bg-white p-6 rounded-lg shadow">
//           <h2 className="text-2xl font-bold mb-4">Create a New Class</h2>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Class Name
//               </label>
//               <input
//                 type="text"
//                 value={className}
//                 onChange={(e) => setClassName(e.target.value)}
//                 className="w-full border rounded px-4 py-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Description
//               </label>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="w-full border rounded px-4 py-2"
//               />
//             </div>
//             <div>
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   checked={useImage}
//                   onChange={(e) => setUseImage(e.target.checked)}
//                 />
//                 <span>Add Class Image?</span>
//               </label>
//             </div>

//             {useImage && (
//               <div className="space-y-2">
//                 <p>Select an image:</p>
//                 <div className="grid grid-cols-2 gap-4">
//                   {imageOptions.map((img, index) => (
//                     <img
//                       key={index}
//                       src={img}
//                       alt="Class Option"
//                       onClick={() => setSelectedImage(img)}
//                       className={`cursor-pointer border-4 rounded ${
//                         selectedImage === img
//                           ? "border-teal-600"
//                           : "border-transparent"
//                       }`}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             <button
//               onClick={handleCreate}
//               disabled={loading}
//               className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700"
//             >
//               {loading ? "Creating..." : "Create Class"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateClass;
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
  const [useImage, setUseImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [imageOptions, setImageOptions] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);

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

  const fetchImages = async () => {
    if (!className.trim()) return alert("Enter class name to fetch images.");

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${className}&client_id=Sp61-19Uf8X_lPJLATzd75FJNlxyIilkHfRYRfW6PCI`
      );
      const data = await response.json();
      setImageOptions(data.results.map((img) => img.urls.small));
      setShowImageModal(true);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleCreate = async () => {
    if (!className.trim()) return alert("Class name is required.");

    setLoading(true);
    try {
      const joinCode = generateJoinCode();
      const ownerId = auth.currentUser.uid;
      const classRef = doc(collection(db, "classrooms"));

      await setDoc(classRef, {
        name: className.trim(),
        description: description.trim(),
        createdAt: serverTimestamp(),
        ownerId: ownerId,
        joinCode: joinCode,
        memberIds: [ownerId],
        imageUrl:
          useImage && selectedImage
            ? selectedImage
            : "https://via.placeholder.com/600x300?text=Default+Image",
      });

      alert(`✅ Class created successfully!\nJoin code: ${joinCode}`);
      setClassName("");
      setDescription("");
      setUseImage(false);
      setSelectedImage("");
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
    setLoading(false);
  };

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

        <div className="max-w-3xl m-5 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Create a New Class</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Class Name
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full border rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useImage}
                  onChange={(e) => setUseImage(e.target.checked)}
                />
                <span>Add Class Image?</span>
              </label>
              {useImage && (
                <button
                  onClick={fetchImages}
                  className="mt-2 bg-teal-500 text-white px-4 py-1 rounded"
                >
                  Fetch Images
                </button>
              )}
            </div>

            {showImageModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-4 rounded-lg shadow max-h-[400px] overflow-y-auto grid grid-cols-3 gap-2">
                  {imageOptions.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="Option"
                      onClick={() => {
                        setSelectedImage(img);
                        setShowImageModal(false);
                      }}
                      className={`cursor-pointer rounded border-2 ${
                        selectedImage === img
                          ? "border-teal-600"
                          : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleCreate}
              disabled={loading}
              className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700"
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
