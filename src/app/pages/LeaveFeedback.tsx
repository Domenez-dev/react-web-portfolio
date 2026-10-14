import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun, Star, CheckCircle2 } from "lucide-react";
import DotGrid from "../components/DotGrid";
import CustomCursor from "../components/CustomCursor";
import { useTheme } from "../hooks/useTheme";
import { supabase } from "../lib/supabaseClient";

const NAME_MAX = 100;
const MESSAGE_MAX = 1000;

export default function LeaveFeedback() {
  const [isDark, setIsDark] = useTheme(true);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  // Honeypot: real visitors never see or fill this field. A bot that fills
  // every input will trip it, and we silently no-op instead of inserting.
  const [company, setCompany] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">(
    "idle",
  );
  const [fieldError, setFieldError] = useState<string | null>(null);

  const bgClass = isDark ? "bg-black" : "bg-white";
  const textClass = isDark ? "text-white" : "text-black";
  const borderClass = isDark ? "border-white" : "border-black";
  const mutedClass = isDark ? "text-white/50" : "text-black/50";
  const inputBgClass = isDark ? "bg-[#080808]" : "bg-[#fafafa]";

  const validate = () => {
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) return "Please enter your name.";
    if (trimmedName.length > NAME_MAX) return `Name must be under ${NAME_MAX} characters.`;
    if (rating < 1 || rating > 5) return "Please select a rating.";
    if (!trimmedMessage) return "Please write a short message.";
    if (trimmedMessage.length > MESSAGE_MAX)
      return `Message must be under ${MESSAGE_MAX} characters.`;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (company.trim() !== "") {
      // Honeypot tripped — pretend success, do nothing.
      setStatus("done");
      return;
    }

    const error = validate();
    if (error) {
      setFieldError(error);
      return;
    }
    setFieldError(null);
    setStatus("submitting");

    const { error: insertError } = await supabase.from("feedback").insert({
      name: name.trim(),
      rating,
      message: message.trim(),
    });

    if (insertError) {
      setStatus("error");
      return;
    }

    setStatus("done");
  };

  const resetForm = () => {
    setName("");
    setRating(0);
    setMessage("");
    setFieldError(null);
    setStatus("idle");
  };

  return (
    <div
      className={`relative w-screen min-h-screen ${bgClass} ${textClass} font-mono`}
    >
      <DotGrid isDark={isDark} />
      <CustomCursor isDark={isDark} />

      <div
        className="noise-overlay fixed inset-0 pointer-events-none z-50 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-40 ${isDark ? "bg-black/70" : "bg-white/70"} backdrop-blur-md border-b ${borderClass}`}
      >
        <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4">
          <Link
            to="/"
            className="text-xs sm:text-sm tracking-wider opacity-60 hover:opacity-100 transition-opacity duration-150"
          >
            BOUZARA ZAKARIA
          </Link>
          <button
            onClick={() => setIsDark(!isDark)}
            className="relative p-2 rounded-lg flex-shrink-0 overflow-hidden group w-[2.833rem] h-[2.833rem]"
          >
            <div className="absolute inset-[-200%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#2563eb_100%)] opacity-80" />
            <div
              className={`absolute inset-[1px] rounded-[7px] ${bgClass} z-0 flex items-center justify-center`}
            >
              <div className="relative z-10">
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </div>
            </div>
          </button>
        </div>
      </nav>

      <main className="px-6 sm:px-8 md:px-16 pt-28 sm:pt-36 pb-20 flex justify-center">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {status === "done" ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`border ${borderClass} ${bgClass} rounded-lg p-8 sm:p-10 text-center`}
              >
                <CheckCircle2 className="w-10 h-10 mx-auto mb-4 text-[#2563eb]" />
                <h1
                  className="text-2xl sm:text-3xl font-bold mb-3"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  THANK YOU
                </h1>
                <p className={`text-sm font-light mb-8 ${mutedClass}`}>
                  Your feedback was submitted. I really appreciate you taking
                  the time.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={resetForm}
                    className={`text-xs sm:text-sm tracking-wider border ${borderClass} ${bgClass} px-5 py-2 rounded-lg hover:border-[#2563eb] hover:text-[#2563eb] transition-colors duration-150`}
                  >
                    Submit another response
                  </button>
                  <Link
                    to="/freelance"
                    className={`text-xs sm:text-sm tracking-wider border border-[#2563eb] text-[#2563eb] ${bgClass} bg-[linear-gradient(#2563eb1a,#2563eb1a)] px-5 py-2 rounded-lg hover:bg-[linear-gradient(#2563eb33,#2563eb33)] transition-colors duration-150`}
                  >
                    View freelance page
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h1
                  className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  LEAVE FEEDBACK
                </h1>
                <p className={`text-sm font-light mb-8 sm:mb-10 ${mutedClass}`}>
                  Worked together on a project? I'd love to hear how it went.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div>
                    <label
                      htmlFor="name"
                      className={`block text-xs tracking-widest mb-2 ${mutedClass}`}
                    >
                      NAME
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={NAME_MAX}
                      placeholder="Your name"
                      className={`w-full border ${borderClass} ${inputBgClass} rounded-lg p-3 outline-none font-mono ${textClass} placeholder:${mutedClass}`}
                    />
                  </div>

                  <div>
                    <span
                      className={`block text-xs tracking-widest mb-2 ${mutedClass}`}
                    >
                      RATING
                    </span>
                    <div
                      className="flex gap-1"
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setRating(n)}
                          onMouseEnter={() => setHoverRating(n)}
                          className="p-1 cursor-pointer"
                          aria-label={`${n} star${n > 1 ? "s" : ""}`}
                        >
                          <Star
                            className="w-6 h-6 transition-colors duration-100"
                            fill={
                              n <= (hoverRating || rating) ? "#2563eb" : "none"
                            }
                            stroke={
                              n <= (hoverRating || rating)
                                ? "#2563eb"
                                : isDark
                                  ? "#ffffff80"
                                  : "#00000080"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className={`block text-xs tracking-widest mb-2 ${mutedClass}`}
                    >
                      MESSAGE
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={MESSAGE_MAX}
                      rows={5}
                      placeholder="Tell me about the project and how it went..."
                      className={`w-full border ${borderClass} ${inputBgClass} rounded-lg p-3 outline-none font-mono resize-none ${textClass} placeholder:${mutedClass}`}
                    />
                    <p className={`text-xs mt-1 text-right ${mutedClass}`}>
                      {message.trim().length}/{MESSAGE_MAX}
                    </p>
                  </div>

                  {/* Honeypot — hidden from real visitors via off-screen styling,
                      not display:none, so it still looks fillable to bots. */}
                  <div
                    aria-hidden="true"
                    className="absolute -left-[9999px] w-px h-px overflow-hidden"
                  >
                    <label htmlFor="company">Company</label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>

                  {fieldError && (
                    <p className="text-sm text-[#ef4444]">{fieldError}</p>
                  )}
                  {status === "error" && (
                    <p className="text-sm text-[#ef4444]">
                      Something went wrong submitting your feedback. Please try
                      again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className={`w-full border ${borderClass} ${bgClass} rounded-lg py-3 text-sm tracking-widest hover:border-[#2563eb] hover:text-[#2563eb] transition-colors duration-150 ${isDark ? "disabled:border-white/40 disabled:text-white/40" : "disabled:border-black/40 disabled:text-black/40"} disabled:hover:border-current`}
                  >
                    {status === "submitting" ? "SUBMITTING..." : "SUBMIT FEEDBACK"}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
