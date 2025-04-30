const upload_preset = "FastMeds";
const cloud_name = "dgvreazly";
const api_url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

export const uploadPrescriptionToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", upload_preset);
  data.append("cloud_name", cloud_name);

  try {
    const res = await fetch(api_url, {
      method: "post",
      body: data,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || "Failed to upload file");
    }

    const fileData = await res.json();
    return fileData.secure_url || fileData.url; // Use both for compatibility
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Prescription upload failed: " + error.message);
  }
};