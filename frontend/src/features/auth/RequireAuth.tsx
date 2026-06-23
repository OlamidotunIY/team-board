import { ScreenLoader } from "@/components";
import type { MeQuery, MeQueryVariables, User } from "@/gql/graphql";
import { extractGraphQLErrors } from "@/utils";
import { useQuery } from "@apollo/client/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { useUserStore } from "@/store/UserStore";
import { GET_USER } from "@/graphql";

const RequireAuth = () =>
{
    const location = useLocation();
    const { setUser, user } = useUserStore();

    const { data, loading } = useQuery<MeQuery, MeQueryVariables>(
        GET_USER,
        {
            onError: (error) =>
            {
                const errors = extractGraphQLErrors(error);
                console.log(errors);
                toast.error(errors[0]?.message);
            },
        }
    );

    useEffect(() =>
    {
        if (!loading && data?.user)
        {
            setUser(data.user as User);
        }
    }, [loading, data?.user, setUser]);

    if (loading)
    {
        return <ScreenLoader />;
    }

    return user.id ? (
        <Outlet />
    ) : (
        <Navigate to="/auth/login" state={{ from: location }} replace />
    );
};

export { RequireAuth };
