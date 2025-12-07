import { useState } from "react";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import { Copy, Check } from "lucide-react";

export default function ReferralModal({ user, onClose }) {
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const createReferral = async () => {
    try {
      setLoading(true);

      const res = await api.post("/admin/users/create-referral", {
        employeeId: user.id,
        slug: slug || undefined,
      });

      setResult(res.data.link);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create referral link");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!result) return;

    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-white mb-4">New Referral Link</h2>

        <div className="text-gray-300 text-sm mb-3">
          User: <span className="font-bold">{user.name || user.email}</span>
        </div>

        {/* Slug Input */}
        {!result && (
          <input
            className="w-full bg-gray-800 border border-gray-700 p-2 rounded-lg text-white mt-1"
            placeholder="custom slug (optional)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        )}

        {/* Button or Result */}
        {!result ? (
          <button
            onClick={createReferral}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 rounded-lg mt-4 transition"
          >
            {loading ? "Creating..." : "Create Link"}
          </button>
        ) : (
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mt-4 relative">
            <p className="text-gray-400 text-sm mb-1">Referral Link</p>

            <div className="flex items-center justify-between">
              <p className="text-emerald-400 font-mono break-all text-sm mr-3">
                {result}
              </p>

              {/* Copy Button */}
              <button
                onClick={copyLink}
                className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-300"
                title="Copy link"
              >
                {copied ? (
                  <Check className="text-emerald-400" size={18} />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>

            {/* "Copied!" Notification Inline */}
            {copied && (
              <div className="text-emerald-400 text-xs mt-2">
                Copied to clipboard
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
