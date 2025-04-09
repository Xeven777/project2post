"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  GithubIcon,
  ArrowRight,
  Code,
  Share2,
  Zap,
  LogOut,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { useMobile } from "@/hooks/use-mobile";
import { auth, signOut } from "@/auth";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Alex Chen",
    role: "Senior Developer at TechCorp",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "LinkedPost has transformed how I share my projects. The AI-generated posts are professional and save me so much time. I've seen a 40% increase in engagement!",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Full Stack Engineer",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "As someone who struggles with writing engaging social media content, this tool is a game-changer. It analyzes my GitHub projects perfectly and creates posts I'm proud to share.",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Open Source Contributor",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "I maintain several open source projects, and LinkedPost helps me announce updates in a professional way. The integration with GitHub is seamless and intuitive.",
  },
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const slideIn = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

export default function LandingPage() {
  const isMobile = useMobile();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.9]);

  const featuresRef = useRef(null);
  const testimonialRef = useRef(null);
  const ctaRef = useRef(null);

  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const testimonialInView = useInView(testimonialRef, {
    once: true,
    amount: 0.2,
  });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.5 });

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const { data: session, status } = useSession(); // Use status from useSession
  const [loading, setLoading] = useState(true); // Keep loading state

  // Effect to update user state based on session and handle loading state
  useEffect(() => {
    if (status === "loading") {
      setLoading(true); // Keep loading if session is loading
    } else {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false); // Set loading to false once session status is determined
    }
  }, [session, status]); // Depend on session and status

  // Effect for testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []); // Empty dependency array is correct here

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-90"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-[120px] transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-linear-to-r from-emerald-600/20 via-blue-600/20 to-indigo-600/20 blur-[120px] transform translate-y-1/2"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-50 backdrop-blur-lg bg-black/50 border-b border-white/10"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="font-bold text-lg">LP</span>
                </div>
                <span className="font-bold text-xl">LinkedPost</span>
              </motion.div>
              <div className="flex items-center space-x-4">
                {loading ? (
                  <div className="h-10 w-20 bg-white/5 rounded animate-pulse"></div>
                ) : user ? (
                  <div className="flex items-center space-x-4">
                    <Link href="/dashboard">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          className="text-white border-white/20 bg-white/5 hover:bg-white/10"
                        >
                          Dashboard
                        </Button>
                      </motion.div>
                    </Link>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name || "User"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm">
                            {user.name?.charAt(0) || "U"}
                          </span>
                        )}
                      </div>
                      <span className="text-sm hidden md:inline">
                        {user.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-400 hover:text-white"
                        onClick={() => signOut({ redirectTo: "/" })}
                        title="Sign out"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Link href="/auth/github">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="text-white border-white/20 bg-white/5 hover:bg-white/10"
                      >
                        Login
                      </Button>
                    </motion.div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative py-20 md:py-32 overflow-hidden"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <motion.div
                className="md:w-1/2 space-y-6 z-10"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeIn}>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400">
                    Powered by AI
                  </span>
                </motion.div>
                <motion.h1
                  className="text-4xl md:text-6xl font-bold leading-tight"
                  variants={slideIn}
                >
                  Transform Your{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
                    GitHub Projects
                  </span>{" "}
                  Into Engaging LinkedIn Content
                </motion.h1>
                <motion.p
                  className="text-lg md:text-xl text-zinc-300 max-w-xl"
                  variants={fadeIn}
                >
                  Automatically generate professional, attention-grabbing
                  LinkedIn posts that showcase your coding projects and
                  highlight your technical expertise.
                </motion.p>
                <motion.div
                  className="pt-4 flex flex-col sm:flex-row gap-4"
                  variants={fadeIn}
                >
                  {!user ? (
                    <Link href="/auth/github">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="lg"
                          className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-700/20"
                        >
                          <GithubIcon className="mr-2 h-5 w-5" />
                          Connect with GitHub
                        </Button>
                      </motion.div>
                    </Link>
                  ) : (
                    <Link href="/dashboard">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="lg"
                          className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-700/20"
                        >
                          Go to Dashboard
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </motion.div>
                    </Link>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-white/20 bg-white/5 hover:bg-white/10"
                    >
                      See How It Works
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                className="md:w-1/2 relative"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative w-full max-w-md mx-auto">
                  {/* Animated glow effect */}
                  <motion.div
                    className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 opacity-75 blur-lg"
                    animate={{
                      background: [
                        "linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))",
                        "linear-gradient(to right, rgb(79, 70, 229), rgb(219, 39, 119))",
                        "linear-gradient(to right, rgb(6, 182, 212), rgb(124, 58, 237))",
                        "linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))",
                      ],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />

                  <div className="relative rounded-2xl bg-zinc-900/90 border border-white/10 p-5 backdrop-blur-xs">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="font-bold">JD</span>
                        </div>
                        <div>
                          <div className="font-semibold">Jane Developer</div>
                          <div className="text-xs text-zinc-400">
                            Full Stack Developer
                          </div>
                        </div>
                      </div>
                      <div className="text-sm">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          🚀{" "}
                          <span className="font-semibold">Just launched:</span>{" "}
                          My latest project{" "}
                          <span className="font-semibold text-blue-400">
                            DevConnect
                          </span>
                        </motion.p>
                        <motion.p
                          className="mt-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          A platform that helps developers find collaborators
                          for open-source projects. Built with React, Node.js,
                          and MongoDB.
                        </motion.p>
                        <motion.p
                          className="mt-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          Key features:
                        </motion.p>
                        <motion.ul
                          className="list-disc list-inside mt-1 space-y-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                        >
                          <li>Real-time project matching</li>
                          <li>Skill-based recommendations</li>
                          <li>Integrated GitHub metrics</li>
                        </motion.ul>
                        <motion.p
                          className="mt-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                        >
                          Check it out: github.com/janedeveloper/devconnect
                        </motion.p>
                        <motion.p
                          className="mt-2 text-blue-400"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 1 }}
                        >
                          #OpenSource #WebDevelopment #React #NodeJS #MongoDB
                        </motion.p>
                      </div>

                      {/* Animated typing cursor */}
                      <motion.div
                        className="h-4 w-2 bg-blue-500"
                        animate={{
                          opacity: [1, 0, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30 flex items-center justify-center"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                >
                  <GithubIcon className="h-8 w-8 text-blue-300" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-5 -left-5 h-16 w-16 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/30 flex items-center justify-center"
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1,
                  }}
                >
                  <Share2 className="h-6 w-6 text-purple-300" />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Tech pattern background */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-full z-0 opacity-10">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -inset-[10%] grid grid-cols-8 gap-1 transform rotate-12">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="h-8 w-full bg-white/5 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div ref={featuresRef} className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How LinkedPost Works
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Generate professional LinkedIn posts in three simple steps
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
            >
              <motion.div className="relative group" variants={scaleUp}>
                <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-br from-blue-600 to-blue-400 opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-xs"></div>
                <div className="relative bg-zinc-900 p-8 rounded-2xl border border-zinc-800 group-hover:border-blue-500/50 transition-colors duration-300 h-full">
                  <div className="h-14 w-14 rounded-xl bg-blue-600/20 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <GithubIcon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors duration-300">
                    1. Connect with GitHub
                  </h3>
                  <p className="text-zinc-400">
                    Securely authenticate with your GitHub account to access
                    your repositories, including private ones.
                  </p>
                </div>
              </motion.div>

              <motion.div className="relative group" variants={scaleUp}>
                <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-br from-purple-600 to-purple-400 opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-xs"></div>
                <div className="relative bg-zinc-900 p-8 rounded-2xl border border-zinc-800 group-hover:border-purple-500/50 transition-colors duration-300 h-full">
                  <div className="h-14 w-14 rounded-xl bg-purple-600/20 text-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Code className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-400 transition-colors duration-300">
                    2. Select a Repository
                  </h3>
                  <p className="text-zinc-400">
                    Choose the GitHub project you want to showcase. We'll
                    analyze your README, code, and dependencies.
                  </p>
                </div>
              </motion.div>

              <motion.div className="relative group" variants={scaleUp}>
                <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-br from-pink-600 to-pink-400 opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-xs"></div>
                <div className="relative bg-zinc-900 p-8 rounded-2xl border border-zinc-800 group-hover:border-pink-500/50 transition-colors duration-300 h-full">
                  <div className="h-14 w-14 rounded-xl bg-pink-600/20 text-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-pink-400 transition-colors duration-300">
                    3. Generate & Share
                  </h3>
                  <p className="text-zinc-400">
                    Our AI analyzes your project and creates multiple
                    professional LinkedIn post variations ready to share.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Animated background elements */}
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] opacity-50"></div>
          <div className="absolute top-1/4 left-0 transform -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-purple-500/10 blur-[100px] opacity-50"></div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div ref={testimonialRef} className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Developers Say
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Join hundreds of developers who are showcasing their projects on
                LinkedIn
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="relative h-[300px] md:h-[250px]">
                <AnimatePresence mode="wait">
                  {testimonials.map(
                    (testimonial, index) =>
                      index === currentTestimonial && (
                        <motion.div
                          key={testimonial.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0"
                        >
                          <div className="relative">
                            <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 opacity-70 blur-lg"></div>
                            <div className="relative bg-zinc-900/90 backdrop-blur-xs p-8 rounded-2xl border border-white/10">
                              <div className="flex flex-col md:flex-row md:items-center gap-6">
                                <div className="shrink-0">
                                  <div className="h-16 w-16 rounded-full bg-linear-to-br from-blue-500 to-purple-600 p-0.5">
                                    <div className="h-full w-full rounded-full overflow-hidden">
                                      <img
                                        src={
                                          testimonial.avatar ||
                                          "/placeholder.svg"
                                        }
                                        alt={testimonial.name}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <p className="text-lg italic text-zinc-300 mb-4">
                                    "{testimonial.content}"
                                  </p>
                                  <div>
                                    <h4 className="font-semibold">
                                      {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-zinc-400">
                                      {testimonial.role}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                  )}
                </AnimatePresence>
              </div>

              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? "w-8 bg-linear-to-r from-blue-500 to-purple-500"
                        : "bg-zinc-600 hover:bg-zinc-500"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div ref={ctaRef} className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-blue-600/50 via-purple-600/50 to-pink-600/50 opacity-70 blur-xl"></div>
                <div className="relative bg-zinc-900/90 backdrop-blur-xs p-12 rounded-3xl border border-white/10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Showcase Your Projects?
                  </h2>
                  <p className="text-zinc-300 text-lg mb-8 max-w-2xl mx-auto">
                    Connect your GitHub account now and start generating
                    professional LinkedIn posts that highlight your technical
                    expertise.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {!user ? (
                      <Link href="/auth/github">
                        <Button
                          size="lg"
                          className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-700/20 text-lg px-8"
                        >
                          <GithubIcon className="mr-2 h-5 w-5" />
                          Get Started for Free
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/dashboard">
                        <Button
                          size="lg"
                          className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-700/20 text-lg px-8"
                        >
                          Go to Dashboard
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </motion.div>
                  <p className="text-zinc-500 text-sm mt-4">
                    No credit card required. Connect in seconds.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Animated background elements */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-linear-to-r from-blue-600/10 to-purple-600/10 blur-[100px] opacity-50"></div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border-t border-zinc-800/50 py-12"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-8 md:mb-0 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="font-bold">LP</span>
                  </div>
                  <span className="font-bold text-xl">LinkedPost</span>
                </div>
                <p className="text-zinc-400 text-sm">
                  © 2025 LinkedPost. All rights reserved.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                <div>
                  <h3 className="font-semibold mb-3 text-sm text-zinc-300">
                    Product
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href="#"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        Features
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-sm text-zinc-300">
                    Company
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href="#"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        About
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        Blog
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        Careers
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-sm text-zinc-300">
                    Legal
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href="#"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        Privacy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        Terms
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        Cookies
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
