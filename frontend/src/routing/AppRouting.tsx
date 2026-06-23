import { RouterProvider } from "react-router-dom";
import { router } from "./router";


const AppRouting = () => {
  return <RouterProvider router={router} />;
};

export { AppRouting };
