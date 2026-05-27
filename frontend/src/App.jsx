import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TaskDashboard from "./pages/TaskDashboard";
import TaskDetails from "./pages/TaskDetails";
import TaskFormPage from "./pages/TaskFormPage";
import StatsPage from "./pages/StatsPage";
import "./App.css";

export default function App() {
  return (
    <div className="app-layout" id="app-root">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<TaskDashboard />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/new" element={<TaskFormPage />} />
          <Route path="/edit/:id" element={<TaskFormPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </main>
    </div>
  );
}