import { Card, FormControl, FormControlLabel, Radio, RadioGroup, Typography, Box } from "@mui/material";
import React, { useState } from "react";
import { OrderTable } from "./OrderTable";

export const Orders = () => {
    const [filterValue, setFilterValue] = useState("ALL");
    
    const orderStatus = [
        { label: "All Orders", value: "ALL" },
        { label: "Pending", value: "PENDING" },
        { label: "Packing", value: "PACKING" },
        { label: "Ready for Pick up", value: "READY_FOR_PICKUP" },
        { label: "Delivered", value: "DELIVERED" }
    ];

    const handleFilter = (e, value) => {
        setFilterValue(value);
    };

    return (
        <Box className="px-5">
            <Card className="p-5" sx={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                marginBottom: '24px'
            }}>
                <Typography 
                    sx={{ 
                        paddingBottom: "1.5rem",
                        fontWeight: 600,
                        color: 'text.primary'
                    }} 
                    variant="h5"
                >
                    Filter Orders
                </Typography>
                <FormControl component="fieldset" fullWidth>
                    <RadioGroup 
                        onChange={handleFilter} 
                        row 
                        name="order-status" 
                        value={filterValue}
                        sx={{
                            gap: '16px',
                            flexWrap: 'wrap'
                        }}
                    >
                        {orderStatus.map((item) => (
                            <FormControlLabel
                                key={item.value}
                                value={item.value}
                                control={<Radio 
                                    color="primary" 
                                    sx={{
                                        padding: '8px',
                                        '& .MuiSvgIcon-root': {
                                            fontSize: '1.25rem'
                                        }
                                    }}
                                />}
                                label={
                                    <Typography variant="body1" sx={{ 
                                        fontWeight: 500,
                                        color: filterValue === item.value ? 'primary.main' : 'text.secondary'
                                    }}>
                                        {item.label}
                                    </Typography>
                                }
                                sx={{
                                    margin: 0,
                                    '&:hover': {
                                        '& .MuiTypography-root': {
                                            color: 'primary.main'
                                        }
                                    }
                                }}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </Card>
            <Box sx={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
                <OrderTable filterStatus={filterValue} />
            </Box>
        </Box>
    );
};