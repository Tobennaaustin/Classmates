import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/sidebar";
import Header from "../components/dashboard/Header";
import { db, auth } from "../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import ReactMarkdown from "react-markdown";

const API_KEY = "AIzaSyAnBBZg_Zq3XzG1R8VmwNVnPSsV_06BZ6I"; // Replace with your real API Key

const ClassmateAI = () => {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [answer, setAnswer] = useState("");
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [classes, setClasses] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return console.log("User not authenticated.");
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

  const handleGetAnswer = async () => {
    try {
      setLoadingAnswer(true);
      const prompt = `You are an AI assistant helping teachers with class management and lesson planning.

The teacher has asked: ${question}

${context ? `Context: ${context}` : ""}

Provide a detailed, helpful, and structured response. Use headings, bullet points or code snippets if necessary.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      const aiResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from AI.";
      setAnswer(aiResponse);
    } catch (error) {
      console.error("Error fetching answer:", error);
    } finally {
      setLoadingAnswer(false);
    }
  };

  const handleGetSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const prompt = `Suggest helpful learning content, resources, and activities for the subject: ${subject} and grade level: ${gradeLevel}. Format the output as:

## Suggested Content

1. **Title** - Type
   Description
   [Link](URL) (if available)`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No suggestions.";
      setSuggestions([text]);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <div
          className={`fixed z-50 h-full bg-gray-900 transition-transform duration-300 ease-in-out w-64 md:relative md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            userClasses={classes}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="flex-1 overflow-y-auto">
          <Header onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="bg-white rounded-lg border border-gray-100 bg-card text-card-foreground shadow-sm">
              <div class="flex flex-col space-y-1.5 p-6">
                <div class="text-2xl font-semibold leading-none tracking-tight flex items-center">
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
                    class="lucide lucide-wand-sparkles mr-2 h-5 w-5 color"
                  >
                    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"></path>
                    <path d="m14 7 3 3"></path>
                    <path d="M5 6v4"></path>
                    <path d="M19 14v4"></path>
                    <path d="M10 2v2"></path>
                    <path d="M7 8H3"></path>
                    <path d="M21 16h-4"></path>
                    <path d="M11 3H9"></path>
                  </svg>{" "}
                  Ask the AI Assistant
                </div>
                <div class="text-sm text-color">
                  Get help with class management, lesson planning, or any
                  teaching-related question.
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="space-y-4">
                  <div>
                    <label
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="teacherQuestion"
                    >
                      Your Question
                    </label>
                    <textarea
                      placeholder="Your Question"
                      className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                  </div>

                  <div>
                    <label
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="questionContext"
                    >
                      Context (Optional)
                    </label>
                    <textarea
                      placeholder="Context (Optional)"
                      className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleGetAnswer}
                    className="bg-teal-600 text-white px-4 py-2 rounded w-full"
                  >
                    {loadingAnswer ? "Loading..." : "Get Answer"}
                  </button>
                </div>
              </div>

              {loadingAnswer && (
                <div className="flex justify-center mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                </div>
              )}
              {answer && !loadingAnswer && (
                <div className="mt-4 bg-gray-100 p-4 rounded overflow-x-auto">
                  <h3 className="font-semibold mb-2">AI's Answer:</h3>
                  <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg border border-gray-100 bg-card text-card-foreground shadow-sm">
              <div class="flex flex-col space-y-1.5 p-6">
                <div class="text-2xl font-semibold leading-none tracking-tight flex items-center">
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
                    class="lucide lucide-wand-sparkles mr-2 h-5 w-5 text-purple-700"
                  >
                    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"></path>
                    <path d="m14 7 3 3"></path>
                    <path d="M5 6v4"></path>
                    <path d="M19 14v4"></path>
                    <path d="M10 2v2"></path>
                    <path d="M7 8H3"></path>
                    <path d="M21 16h-4"></path>
                    <path d="M11 3H9"></path>
                  </svg>{" "}
                  Content Suggestions
                </div>
                <div class="text-sm text-color">
                  Find relevant content, resources, and activities for your
                  lessons.
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-4">
                  <div>
                    <label
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="subject"
                    >
                      Subject
                    </label>
                    <input
                      placeholder="Subject (e.g., Mathematics, CSC 205)"
                      className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  <div>
                    <label
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="gradeLevel"
                    >
                      Grade Level
                    </label>

                    <input
                      placeholder="Grade Level (e.g., 10th Grade, 200 level)"
                      className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleGetSuggestions}
                    className="bg-purple-700 text-white px-4 py-2 rounded w-full"
                  >
                    {loadingSuggestions ? "Loading..." : "Get Suggestions"}
                  </button>
                </div>
              </div>

              {loadingSuggestions && (
                <div className="flex justify-center mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-700"></div>
                </div>
              )}
              {suggestions.length > 0 && !loadingSuggestions && (
                <div className="mt-4 bg-gray-100 p-4 rounded overflow-x-auto">
                  <h3 className="font-semibold mb-2 text-purple-700">
                    AI's Suggestions:
                  </h3>
                  {suggestions.map((item, idx) => (
                    <ReactMarkdown key={idx}>{item}</ReactMarkdown>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassmateAI;
