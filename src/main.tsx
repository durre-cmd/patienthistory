import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 👈 for routing
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={import.meta.env.DEV ? "/" : "/patienthistory/"}>
    <App />
  </BrowserRouter>
);
