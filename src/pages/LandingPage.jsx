import React, { useState, useEffect } from "react";
import {
  Users,
  MessageCircle,
  Upload,
  Brain,
  Video,
  Mic,
  BookOpen,
  Sparkles,
  ArrowRight,
  Play,
} from "lucide-react";


const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);


  const words = ["Learning", "Collaboration", "Success", "Growth"];
  const fullText = "Supercharge Your ";

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const typeText = () => {
      const currentWord = words[currentWordIndex];
      const targetText = fullText + currentWord;

      if (isTyping) {
        if (typedText.length < targetText.length) {
          setTimeout(() => {
            setTypedText(targetText.slice(0, typedText.length + 1));
          }, 100);
        } else {
          setTimeout(() => {
            setIsTyping(false);
          }, 2000);
        }
      } else {
        if (typedText.length > fullText.length) {
          setTimeout(() => {
            setTypedText(typedText.slice(0, -1));
          }, 50);
        } else {
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setIsTyping(true);
        }
      }
    };

    typeText();
  }, [typedText, isTyping, currentWordIndex, words, fullText]);

  const features = [
    {
      icon: Users,
      title: "Create Study Groups",
      description:
        "Build your perfect study environment with classmates who share your academic goals",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: MessageCircle,
      title: "Real-time Communication",
      description:
        "Text, voice, and video chat to collaborate seamlessly with your study partners",
      color: "from-purple-600 to-purple-700",
    },
    {
      icon: Upload,
      title: "Share Resources",
      description:
        "Upload and share notes, documents, and study materials instantly with your group",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description:
        "Intelligent tools that adapt to your learning style and boost productivity",
      color: "from-purple-600 to-purple-700",
    },
  ];

  const windows = typeof window !== "undefined" ? window : { location: { href: "/" } };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden relative">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle Floating Orbs */}
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-purple-100 rounded-full opacity-30 animate-bounce"
          style={{ animationDuration: "6s" }}
        ></div>
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-purple-50 rounded-full opacity-40 animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-32 left-40 w-40 h-40 bg-purple-100 rounded-full opacity-25 animate-ping"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-28 h-28 bg-purple-50 rounded-full opacity-35 animate-bounce"
          style={{ animationDuration: "5s" }}
        ></div>

        {/* Subtle Wave Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 800"
            preserveAspectRatio="none"
          >
            <path
              d="M0,400 Q300,200 600,400 T1200,400 V800 H0 Z"
              fill="url(#wave1)"
              className="animate-pulse"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0; 50 0; 0 0"
                dur="10s"
                repeatCount="indefinite"
              />
            </path>
            <defs>
              <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#611f69" />
                <stop offset="50%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#611f69" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Minimal Grid Pattern */}
        <div
          className="absolute inset-0 opacity-3"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(97, 31, 105, 0.1) 1px, transparent 0)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center space-x-2">
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
            class="lucide lucide-book-text h-6 w-6 text-purple-600"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
            <path d="M8 11h8"></path>
            <path d="M8 7h6"></path>
          </svg>
          <span className="text-xl font-bold text-gray-900">Classmate</span>
        </div>

        <button
          className="px-6 py-2 rounded-full text-white font-medium transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
          style={{ background: "linear-gradient(to right, #611f69, #7c3aed)" }}
          onClick={() => (windows.location.href = "/signup")}
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="inline-block min-h-[1.2em] bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              {typedText}
              <span className="animate-pulse text-purple-600">|</span>
            </span>
            <br />
            <span className="relative inline-block text-gray-900">
              with Classmate
              <Sparkles className="absolute -top-2 -right-8 w-8 h-8 text-purple-500 animate-bounce" />
            </span>
            <br />
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create or join a group, collaborate in real time, share files, talk,
            and learn together. Built with modern tools and AI to{" "}
            <span className="text-purple-600 font-semibold">
              supercharge your learning
            </span>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="px-8 py-4 rounded-full text-lg font-semibold text-white transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              style={{
                background: "linear-gradient(to right, #611f69, #7c3aed)",
              }}
              onClick={() => (windows.location.href = "/signup")}
            >
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition-all flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Everything You Need to Excel
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`relative p-6 rounded-2xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                    activeFeature === index
                      ? "ring-2 ring-purple-400 scale-105 shadow-lg"
                      : ""
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4`}
                    style={{
                      background: "linear-gradient(to right, #611f69, #7c3aed)",
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl opacity-0 hover:opacity-50 transition-opacity duration-300"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Feature Showcase */}
      <section className="relative z-10 px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Collaborate Like Never Before
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Join thousands of students who are transforming their study
                experience. Create study groups, share resources instantly, and
                communicate through text, voice, and video - all in one powerful
                platform.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">✓</span>
                  </div>
                  <span className="text-gray-700">
                    Real-time collaboration tools
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">✓</span>
                  </div>
                  <span className="text-gray-700">
                    AI-powered study assistance
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">✓</span>
                  </div>
                  <span className="text-gray-700">Seamless file sharing</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500 ml-4">
                    Classmate Study Group
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "#611f69" }}
                    >
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Physics Study Group
                      </div>
                      <div className="text-xs text-gray-500">
                        5 members online
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "#7c3aed" }}
                    >
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm text-gray-700">
                      Sarah shared: "Chapter 3 notes.pdf"
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "#8b5cf6" }}
                    >
                      <Video className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm text-gray-700">
                      Study session starting in 5 minutes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students who are already using Classmate to ace
            their studies.
          </p>
          <button
            className="px-12 py-4 rounded-full text-xl font-semibold text-white transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
            style={{
              background: "linear-gradient(to right, #611f69, #7c3aed)",
            }}
            onClick={() => (windows.location.href = "/signup")}
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
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
              class="lucide lucide-book-text h-6 w-6 text-purple-600"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
              <path d="M8 11h8"></path>
              <path d="M8 7h6"></path>
            </svg>
            <span className="text-xl font-bold text-gray-900">Classmate</span>
          </div>
          <div className="text-gray-500">
            © 2025 Classmate. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all hover:scale-110"
            >
              <span className="text-2xl text-gray-600 hover:text-gray-800">
                ×
              </span>
            </button>

            {/* Video Container */}
            <div className="relative aspect-video bg-gray-100">
              {/* Replace this src with your actual video URL */}
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                poster="/api/placeholder/800/450" // Optional: Add a poster image
              >
                <source src="/path-to-your-demo-video.mp4" type="video/mp4" />
                <source src="/path-to-your-demo-video.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>

              {/* Fallback content while you create your video */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center p-8">
                  <Play className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Demo Video Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    We're preparing an amazing demo video to show you all the
                    features of Classmate.
                  </p>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Classmate Demo
              </h3>
              <p className="text-gray-600">
                See how easy it is to create study groups, collaborate in
                real-time, and supercharge your learning with AI-powered tools.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
