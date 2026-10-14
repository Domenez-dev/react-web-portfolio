
  import { createRoot } from "react-dom/client";
  import { BrowserRouter, Routes, Route } from "react-router";
  import App from "./app/App.tsx";
  import Freelance from "./app/pages/Freelance.tsx";
  import LeaveFeedback from "./app/pages/LeaveFeedback.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/freelance" element={<Freelance />} />
        <Route path="/leave-feedback" element={<LeaveFeedback />} />
      </Routes>
    </BrowserRouter>,
  );
