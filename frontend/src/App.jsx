import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CreateOrder from "./pages/CreateOrder";
import EditOrder from "./pages/EditOrder";
import OrderHistory from "./pages/OrderHistory";

import "./App.css";

const App = () => {
    return (
        <BrowserRouter>
            <div className="app-container">
                <Navbar />
                <main className="container animate-fade-in">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/create" element={<CreateOrder />} />
                        <Route path="/edit/:id" element={<EditOrder />} />
                        <Route path="/history/:id" element={<OrderHistory />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
};

export default App;
