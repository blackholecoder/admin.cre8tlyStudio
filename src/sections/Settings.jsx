import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";

export default function Settings() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(""); // ✅ show profile image
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [maintenance, setMaintenance] = useState(false);


  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");


  useEffect(() => {
  const fetchMaintenance = async () => {
    try {
      const res = await api.get(
        "/admin/settings/maintenance");
      setMaintenance(res.data.maintenance);
    } catch {
      console.warn("Could not fetch maintenance status");
    }
  };
  fetchMaintenance();
}, [token]);

  // ✅ Fetch current user profile (including image)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/admin/auth/me");
        if (res.data.email) setEmail(res.data.email);
        if (res.data.profile_image) setPreview(res.data.profile_image);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  // ✅ Handle email/password update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let base64Image = null;
      if (image) {
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(image);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      }

      await api.put(
        "/auth/admin/update",
        { email, currentPassword, newPassword, profileImage: base64Image },
      );

      toast.success("Settings updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle profile image upload separately
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Please select an image first");
    if (image.size > 2 * 1024 * 1024)
      return toast.error("Image must be under 2 MB");

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {

      try {
        const base64 = reader.result.split(",")[1];
        const res = await api.put(
          "/auth/admin/upload-image",
          {
            imageData: base64,
            fileName: image.name,
            mimeType: image.type,
          },
        );

        toast.success("Profile image updated!");
        setImage(null);

        // ✅ Immediately refresh preview without manual reload
        if (res.data.imageUrl) {
          setPreview(res.data.imageUrl);
        } else {
          const me = await api.get("/admin/auth/me");
          if (me.data.profile_image) setPreview(me.data.profile_image);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Image upload failed");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(image);
  };

  // ✅ Enable 2FA
  const enable2FA = async () => {
    try {
      const res = await api.post(
        "/auth/admin/enable-2fa",
        {},
      );
      setQr(res.data.qr);
      toast.info("Scan the QR with Google Authenticator!");
    } catch {
      toast.error("Failed to enable 2FA");
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white lead-text">Account Settings</h1>

      {/* === Image Upload === */}
      <form
        onSubmit={handleImageUpload}
        className="space-y-4 bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg text-center"
      >
        {/* ✅ Current Image Preview */}
        <div className="flex flex-col items-center gap-3">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-teal-500 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-2 border-gray-700 flex items-center justify-center text-gray-500 lead-text">
              No Image
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2 lead-text">
            Profile Image (max 2 MB)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-gray-300 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full py-2 bg-royalPurple hover:bg-green text-white rounded-md transition lead-text"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </form>

      {/* === Email/Password Update === */}
      <form
        onSubmit={handleUpdate}
        className="space-y-4 bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg"
      >
        <div>
          <label className="block text-gray-400 text-sm mb-2 lead-text">New Email</label>
          <input
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-gray-800 text-gray-200 rounded-md border border-gray-700 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2 lead-text">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 bg-gray-800 text-gray-200 rounded-md border border-gray-700 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2 lead-text">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 bg-gray-800 text-gray-200 rounded-md border border-gray-700 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-red-600 hover:bg-green hover:text-black text-white rounded-md transition"
        >
          {loading ? "Saving..." : "Update"}
        </button>
      </form>

      {/* === Two-Factor Authentication === */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 text-center">
        <h2 className="text-lg font-semibold text-white mb-2 lead-text">
          Two-Factor Authentication
        </h2>
        {!qr ? (
          <button
            onClick={enable2FA}
            className="py-2 px-4 bg-white hover:bg-purple-700 rounded-md text-black lead-text"
          >
            Enable 2FA
          </button>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-2 lead-text">
              Scan this QR in Google Authenticator:
            </p>
            <img
              src={qr}
              alt="2FA QR"
              className="mx-auto w-40 h-40 border border-gray-700 rounded-lg"
            />
          </>
        )}
        {/* === Maintenance Mode === */}


      </div>
      {role === "superadmin" && (
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 text-center space-y-3">
  <h2 className="text-lg font-semibold text-white lead-text">Maintenance Mode</h2>
  <p className="text-gray-400 text-sm lead-text">
    Toggle to temporarily disable access for all users.
  </p>

  <button
    onClick={async () => {
  try {
    // Fetch current status
    const statusRes = await api.get(
      "https://cre8tlystudio.com/api/admin/settings/maintenance",
    );
    const current = statusRes.data.maintenance;

    // Flip it
    const res = await api.post(
      "https://cre8tlystudio.com/api/admin/settings/maintenance",
      { enabled: !current },
    );

    const newStatus = res.data.maintenance;
    setMaintenance(newStatus);

    // ✅ Toast color feedback
    if (newStatus) {
      toast.success("Maintenance mode enabled", { theme: "colored" });
    } else {
      toast.error("Maintenance mode disabled", { theme: "colored" });
    }
  } catch (err) {
    console.error("Toggle failed:", err);
    toast.error("Failed to toggle maintenance mode");
  }
}}

    className={`px-5 py-2 rounded-md font-semibold transition ${
      maintenance
        ? "bg-green hover:bg-green text-black"
        : "bg-red-600 hover:bg-red-700 text-white"
    }`}
  >
    {maintenance ? "Maintenance Enabled" : "Enable Maintenance"}
  </button>
</div>
      )}

    </div>
  );
}
