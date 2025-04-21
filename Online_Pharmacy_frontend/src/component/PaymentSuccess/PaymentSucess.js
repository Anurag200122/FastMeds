import React from "react";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Button, Card } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { green } from "@mui/material/colors";
import PrescriptionUpload from "./PrescriptionUpload.jsx";

export const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Order ID from the URL

  return (
    <div className="min-h-screen px-5 py-8 bg-gray-50 overflow-y-auto">
      <div className="flex flex-col items-center justify-start min-h-screen">
        <Card className="w-full max-w-2xl p-6 rounded-xl shadow-lg">
          <div className="flex flex-col items-center text-center">
            <TaskAltIcon sx={{ fontSize: "5rem", color: green[500] }} />
            <h1 className="py-5 text-2xl font-semibold">Order Success!</h1>
            <p className="py-3 text-gray-500">
              Thank you for choosing our Pharmacy! We appreciate your order.
            </p>
            <p className="py-2 text-gray-600 text-lg">Have a Great Day!</p>
          </div>

          {/* Prescription Upload Component */}
          <div className="mt-6">
            <PrescriptionUpload orderId={id} />
          </div>

          <Button
            onClick={() => navigate("/")}
            variant="contained"
            className="mt-6"
            fullWidth
          >
            Go To Home
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
