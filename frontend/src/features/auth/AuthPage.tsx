import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/RegisterPage";
import AuthLayout from "@/layout/AuthLayout";

const AuthPage = () => (
    <Routes>
        <Route element={<AuthLayout />}>
            <Route path="auth/login" element={<LoginPage />} />
            <Route path="auth/signup" element={<SignUpPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
);

export { AuthPage };
