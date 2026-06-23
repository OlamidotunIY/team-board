import type { MeQuery, MeQueryVariables } from "@/gql/graphql";
import { useQuery } from "@apollo/client/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useUserStore } from "@/store/UserStore";
import { GET_USER } from "@/graphql";
import type { UserEntity } from "@/gql/schema-types";
import { ScreenLoader } from "@/components/custom/ScreenLoader";

const RequireAuth = () =>
{
    const location = useLocation();
    const { setUser, user } = useUserStore();

    const { data, loading } = useQuery<MeQuery, MeQueryVariables>(
        GET_USER,
    );

    useEffect(() =>
    {
        if (!loading && data?.currentUser)
        {
            setUser(data.currentUser as UserEntity);
        }
    }, [loading, data?.currentUser, setUser]);

    if (loading)
    {
        return <ScreenLoader />;
    }

    return user?.id ? (
        <Outlet />
    ) : (
        <Navigate to="/auth/login" state={{ from: location }} replace />
    );
};

export { RequireAuth };
