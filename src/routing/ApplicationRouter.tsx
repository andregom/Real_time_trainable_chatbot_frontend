import { BrowserRouter, Route, Routes, Router, Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import AdminsPage from "../pages/AdminsPage";
import UsersPage from "../pages/UsersPage";
import IssuesPage from "../pages/IssuesPage";
import DatabasePage from "../pages/DatabasePage";
import ChatPage from "../pages/ChatPage";
import RequireAuth from "./RequireAuth";


const ApplicationRouter: React.FC = () => {
    return (
        <>
            <NavBar />
            <Routes>
                {/* Public */}
                {/* {<Route path="/user-login" element={<UserLogin />} />} */}

                {/* Private */}
                <Route element={<RequireAuth />}>
                    <Route path="/" element={
                        <Navigate to="/admin" />
                    } />
                    <Route path='/admin' element={<AdminsPage />} />
                    <Route path='/user' element={<UsersPage />} />
                    <Route path='/talk' element={<ChatPage />} />
                    <Route path='/register' element={<IssuesPage />} />
                    <Route path='/edit-database' element={<DatabasePage editPermission={true}/>} />
                    <Route path='/view-database' element={<DatabasePage editPermission={false}/>} />
                </Route>
            </Routes>
        </>
    );
}

export default ApplicationRouter;