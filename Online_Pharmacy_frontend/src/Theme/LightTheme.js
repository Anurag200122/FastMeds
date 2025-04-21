import { createTheme } from "@mui/material";

export const LightTheme = createTheme({
    palette: {
        mode: "light",  // Changed to light mode for better visibility
        primary: {
            main: "#3f51b5", // Trustworthy medical blue
            contrastText: "#ffffff" // White text for contrast
        },
        secondary: {
            main: "#4caf50", // Healing green
            contrastText: "#ffffff"
        },
        background: {
            default: "#f5f7fa", // Soft light blue-gray
            paper: "#ffffff" // Pure white for cards/containers
        },
        text: {
            primary: "#334155", // Dark blue-gray for main text
            secondary: "#64748b" // Medium gray for secondary text
        }
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)", // Subtle shadow
                    borderRadius: "12px" // Rounded corners
                }
            }
        }
    }
});