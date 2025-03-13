import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router";
import Notes from "./components/Notes/notes.tsx";
import Tasks from "./components/Tasks/tasks.tsx";
import SingleNote from "./components/SingleNote/single-note.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="notes" element={<Notes />}>
              <Route path=":id" element={<SingleNote />} />
            </Route>
            <Route path="tasks" element={<Tasks />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
