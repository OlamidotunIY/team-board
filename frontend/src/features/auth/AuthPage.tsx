import { Navigate } from "react-router-dom";
import { PATHS } from "@/routing/paths";

const AuthPage = () => (
    <Navigate to={PATHS.auth.login} replace />
);

export { AuthPage };
