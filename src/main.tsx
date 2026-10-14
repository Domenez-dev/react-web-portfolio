
  import { createRoot } from "react-dom/client";
  import { BrowserRouter, Routes, Route } from "react-router";
  import { MotionConfig } from "motion/react";
  import App from "./app/App.tsx";
  import Freelance from "./app/pages/Freelance.tsx";
  import LeaveFeedback from "./app/pages/LeaveFeedback.tsx";
  import { initPerformanceMode, useIsLite } from "./app/lib/performance.ts";
  import "./styles/index.css";

  initPerformanceMode();

  // In lite mode Motion skips transform/layout animations (opacity fades stay),
  // which is most of the per-frame work on slow phones.
  function Root() {
    const isLite = useIsLite();
    return (
      <MotionConfig reducedMotion={isLite ? "always" : "never"}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/freelance" element={<Freelance />} />
            <Route path="/leave-feedback" element={<LeaveFeedback />} />
          </Routes>
        </BrowserRouter>
      </MotionConfig>
    );
  }

  createRoot(document.getElementById("root")!).render(<Root />);
