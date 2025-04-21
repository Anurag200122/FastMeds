import React from "react";
import { DossageTable } from "./DossageTable";
import { DossageCategoryTable } from "./DossageCategoryTable";
import { Grid } from "@mui/material";

export const Dossage=()=>{

    return(
        <div className="px-10">
            <Grid container spacing={2}  >
                <Grid item xs={12} lg={8}>
                    <DossageTable/>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <DossageCategoryTable/>
                </Grid>
            </Grid>
            
        </div>
    )
}