import React, { useEffect } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../State/Authentication/Action.js"; // Import the logout action
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Access user data from the Redux store
    const { user, isLoading, error } = useSelector((state) => state.auth);

    // Fetch user profile data when the component mounts
    useEffect(() => {
        const jwt = localStorage.getItem("jwt"); // Get JWT token from localStorage
        if (jwt) {
            dispatch(getUser(jwt)); // Dispatch the getUser action
        }
    }, [dispatch]);

    // Logout handler
    const handleLogout = () => {
        dispatch(logout()); // Dispatch the logout action
        navigate("/"); // Redirect to the home page
    };

    if (isLoading) {
        return <div>Loading...</div>; // Show loading state while fetching data
    }

    if (error) {
        return <div>Error: {error}</div>; // Show error message if fetching fails
    }

    if (!user) {
        return <div>No user data found.</div>; // Show message if user data is not available
    }

    return (
        <div className="min-h-[80vh] flex flex-col justify-center items-center text-center">
            <div className="flex flex-col items-center justify-center">
                <AccountCircleIcon sx={{ fontSize: "9rem" }} />
                <h1 className="py-5 text-2xl font-semibold">{user.fullName}</h1>
                <p>Email: {user.email}</p>
                <Button
                    variant="contained"
                    onClick={handleLogout} // Add onClick handler for logout
                    sx={{ margin: "2rem 0rem" }}
                >
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default UserProfile;