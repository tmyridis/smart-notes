import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router";
import Notes from "./components/Notes/NoteSidebar/noteSidebar.tsx";
import TaskSidebar from "./components/Tasks/TasksSidebar/sidebar.tsx";
import SingleNote from "./components/Notes/single-note.tsx";
import Tasks from "./components/Tasks/tasks.tsx";
import Home from "./components/Home/index.tsx";
import LandingPage from "./components/LandingPage/index.tsx";
import { AuthProvider } from "./context/authContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route element={<App />}>
              <Route path="home" element={<Home />} />
              <Route path="notes" element={<Notes />}>
                <Route path=":id" element={<SingleNote />} />
              </Route>
              <Route path="tasks" element={<TaskSidebar />}>
                <Route path=":id" element={<Tasks />}></Route>
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
