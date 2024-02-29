import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage/AdminPage";
import MyCalendar from "./pages/Calendar/Calendar"; // Import your Calendar component
import Navbar from "./pages/Navbar/Navbar"; // Import your Navbar component
import UsersPage from "./pages/UsersPage/UsersPage"; // Import your UsersPage component
import VisitsPage from "./pages/VisitsPage/VisitsPage"; // Import your VisitsPage component
import ClientsPage from "./pages/ClientsPage/ClientsPage"; // Import your ClientsPage component
import { ADDRCONFIG } from "dns";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/users' element={ <UsersPage /> } />
        <Route path='/visits' element={ <VisitsPage /> } />
        <Route path='/clients' element={ <ClientsPage /> } />
        <Route path='/calendar' element={ <MyCalendar /> } />
        <Route path='*' element={ <AdminPage /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;