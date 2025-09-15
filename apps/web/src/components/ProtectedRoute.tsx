import { userAuthStore } from "../store/authStore";
import {Navigate} from "react-router-dom"

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, isError, errorMessage } = userAuthStore();

  if(!isLoading && !isAuthenticated){
    return <Navigate to="/auth"/>
  }

  if (isError) {
    return <p className="text-rose-400">Some error occured: {errorMessage}</p>;
  }

  if (isLoading) {
    return <p>Loading....</p>;
  }

  if (isAuthenticated) {
    return <div>{children}</div>;
  }
};
