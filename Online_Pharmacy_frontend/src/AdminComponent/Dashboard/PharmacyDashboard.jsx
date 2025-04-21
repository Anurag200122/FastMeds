import { Grid, Box, Paper } from "@mui/material";
import { MenuTable } from '../Menu/MenuTable';
import { Orders } from "../Orders/Orders";
import React, { useState } from "react";

export const PharmacyDashboard = () => {
    const [orderFilter, setOrderFilter] = useState("ALL");

    return (
        <Box sx={{ 
            p: 4,
            backgroundColor: '#f8fafc',
            minHeight: 'calc(100vh - 64px)'
        }}>
            <Grid container spacing={4}>
                {/* Orders Section - Now first in the layout */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{
                            p: 3,
                            backgroundColor: '#3f51b5',
                            color: 'white'
                        }}>
                            <h2 className="text-xl font-semibold">Recent Orders</h2>
                        </Box>
                        <Box sx={{ p: 2, flex: 1 }}>
                            <Orders />
                        </Box>
                    </Paper>
                </Grid>
                
                {/* Menu Section - Now below the Orders section */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{
                            p: 3,
                            backgroundColor: '#4caf50',
                            color: 'white'
                        }}>
                            <h2 className="text-xl font-semibold">Medicine Inventory</h2>
                        </Box>
                        <Box sx={{ p: 2, flex: 1 }}>
                            <MenuTable />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};