import { Box, Modal } from '@mui/material'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { style } from '../Cart/Cart';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import ForgotPasswordForm from './ForgotPasswordForm'; // Make sure to create this component
import ResetPasswordForm from './ResetPasswordForm';

// export const Auth = () => {
//     const location=useLocation();
//     const navigate=useNavigate();
//     const handleOnClose=()=>{
//         navigate("/")
//     }
//   return (
//     <>
//         <Modal onClose={handleOnClose} open={
//             location.pathname==="/account/register"
//             || location.pathname==="/account/login"
//         }>
//             <Box sx={style}>
//                {location.pathname==="/account/register"?<RegisterForm/>:<LoginForm/>}
//             </Box>

//         </Modal>
//     </>
//   )
// }



export const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const handleOnClose = () => {
        navigate("/");
    }

    const renderForm = () => {
        switch(location.pathname) {
            case "/account/register":
                return <RegisterForm />;
            case "/account/forgot-password":
                return <ForgotPasswordForm />;
            case "/account/reset-password":
                return <ResetPasswordForm />;
            case "/account/login":
            default:
                return <LoginForm />;
        }
    }

    return (
        <>
            <Modal 
                onClose={handleOnClose} 
                open={
                    location.pathname === "/account/register" ||
                    location.pathname === "/account/login" ||
                    location.pathname === "/account/forgot-password" ||
                    location.pathname === "/account/reset-password" 
                }
            >
                <Box sx={style}>
                    {renderForm()}
                </Box>
            </Modal>
        </>
    )
}