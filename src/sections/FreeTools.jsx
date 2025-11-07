import { useState } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";

export default function FreeTools() {
  const [loading, setLoading] = useState(false);

  const handleGiveTools = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      await api.post(
        "/admin/give-free-magnets",
        { count: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ 1 free digital asset slot added to your account!");
    } catch (err) {
      console.error("Error giving free slot:", err);
      toast.error(err.response?.data?.message || "Failed to add free slot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold text-white mb-6">Free Digital Asset</h1>
      <p className="text-gray-400 mb-4">
        Click below to add <span className="text-green font-semibold">1 free digital slot</span> to your account.
      </p>
      <button
        onClick={handleGiveTools}
        disabled={loading}
        className="bg-green hover:bg-green/90 px-6 py-3 text-black font-semibold rounded-md transition"
      >
        {loading ? "Processing..." : "Add Free Digital Slot"}
      </button>
    </div>
  );
}
