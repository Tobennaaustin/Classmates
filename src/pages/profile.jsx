import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import Sidebar from "../components/dashboard/sidebar";
import Header from "../components/dashboard/Header";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [classes, setClasses] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    // Fetch user profile data from Firestore
    const fetchUserData = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
        setDisplayName(userSnap.data().displayName || "");
        setPhotoURL(userSnap.data().photoURL || "");
      }
    };

    // Fetch user classes
    const q = query(
      collection(db, "classrooms"),
      where("memberIds", "array-contains", user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const classList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClasses(classList);
    });

    fetchUserData();
    return () => unsubscribe();
  }, [user]);

  const handleUpdate = async () => {
    if (!user) return;

    setLoading(true);
    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, {
        displayName,
        photoURL,
      });
      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
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

        <div className="p-6 max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

          {userData ? (
            <div className="bg-white p-6 rounded shadow space-y-4">
              <div className="flex items-center gap-4">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-300 flex items-center justify-center rounded-full text-xl font-bold text-white">
                    {userData.displayName?.slice(0, 2) || "U"}
                  </div>
                )}
                <div>
                  <p className="text-gray-700">
                    <strong>Email:</strong> {user.email}
                  </p>
                  {!editMode ? (
                    <p className="text-gray-700">
                      <strong>Name:</strong> {userData.displayName}
                    </p>
                  ) : (
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="border px-3 py-1 rounded w-full"
                      placeholder="Enter your name"
                    />
                  )}
                </div>
              </div>

              {editMode && (
                <div>
                  <label className="block text-gray-700 mb-1">Photo URL</label>
                  <input
                    type="text"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    className="border px-3 py-1 rounded w-full"
                    placeholder="Enter photo URL"
                  />
                </div>
              )}

              <div className="flex gap-4">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleUpdate}
                      disabled={loading}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="bg-gray-300 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}

          <h3 className="text-xl font-semibold mt-8 mb-4">My Classes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map((cls) => (
              <div key={cls.id} className="bg-white p-4 rounded shadow">
                <p className="font-semibold capitalize">{cls.name}</p>
                <p className="text-sm text-gray-500">
                  Members: {cls.memberIds.length}
                </p>
                <p className="text-sm text-gray-500">
                  Join Code: {cls.joinCode}
                </p>
              </div>
            ))}
            {classes.length === 0 && (
              <p className="text-gray-500">You are not in any class.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
