import { useEffect, useState } from "react";
import { Download, ExternalLink, MessageCircleOff, MessageCircleReply, Package } from "lucide-react";
import { api } from "../api/axios";

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const limit = 20;

  useEffect(() => {
    load(page);
  }, [page]);

  async function load(p) {
    try {
      const res = await api.get(
        `/admin/deliveries/admin-deliveries?page=${p}&limit=${limit}`
      );
      setDeliveries(res.data.deliveries || []);
      setPagination(res.data.pagination || null);
    } catch (err) {
      console.error("Failed to load deliveries:", err);
    }
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2 lead-text">
        <Package size={22} className="text-teal-400" />
        Deliveries
      </h1>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="py-3 text-sm font-medium">Seller</th>
              <th className="py-3 text-sm font-medium">Buyers Email</th>
              <th className="py-3 text-sm font-medium">Product</th>
              <th className="py-3 text-sm font-medium">Delivered</th>
              <th className="py-3 text-sm font-medium">Landing Page</th>
              <th className="py-3 text-sm font-medium">Download</th>
              <th className="py-3 text-sm font-medium">Thank You</th>
            </tr>
          </thead>

          <tbody>
  {deliveries.map((d) => (
    <tr
      key={d.id}
      className="border-b border-gray-800 hover:bg-gray-800/40 transition"
    >
      <td className="py-3 text-white">{d.buyer_name}</td>

      <td className="py-3 text-gray-300 break-all">{d.buyer_email}</td>

      <td className="py-3 text-gray-300 break-all">{d.product_name}</td>

      <td className="py-3 text-gray-300">
        {new Date(d.delivered_at).toLocaleString()}
      </td>

      {/* Landing Page (correct position now) */}
      <td className="py-3">
        {d.landing_url ? (
          <a
            href={d.landing_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 transition underline"
          >
            <ExternalLink size={16} />
          </a>
        ) : (
          <span className="text-gray-500">None</span>
        )}
      </td>

      {/* Download */}
      <td className="py-3">
        {d.download_url ? (
          <a
            href={d.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 transition flex items-center gap-1"
          >
            <Download size={16} />
          </a>
        ) : (
          <span className="text-gray-500">None</span>
        )}
      </td>

      {/* Thank You Status */}
      <td className="py-3">
        {d.thank_you_sent ? (
          <span className="px-2 py-1 text-xs text-teal-400 rounded-md">
            <MessageCircleReply size={16} />
          </span>
        ) : (
          <span className="px-2 py-1 text-xs text-red-400 rounded-md">
            <MessageCircleOff size={16} />
            
          </span>
        )}
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {deliveries.map((d) => (
          <div
            key={d.id}
            className="bg-gray-800/70 border border-gray-700 rounded-lg p-4 space-y-2"
          >
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Seller</span>
              <span className="text-white">{d.buyer_name}</span>
            </div>

            <div>
              <span className="text-gray-400 text-sm block">Buyer Email</span>
              <span className="text-gray-300 break-all">{d.buyer_email}</span>
            </div>

            <div>
              <span className="text-gray-400 text-sm block">Product</span>
              <span className="text-gray-300">{d.product_name}</span>
            </div>

            <div>
              <span className="text-gray-400 text-sm block">Delivered</span>
              <span className="text-gray-300">
                {new Date(d.delivered_at).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-400 text-sm block">Landing Page</span>
              {d.landing_url ? (
                <a
                  href={d.landing_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 underline"
                >
                  {d.landing_url}
                </a>
              ) : (
                <span className="text-gray-500">None</span>
              )}
            </div>

            <div>
              <span className="text-gray-400 text-sm block">Download</span>
              {d.download_url ? (
                <a
                  href={d.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 hover:text-teal-300 flex items-center gap-1"
                >
                  <Download size={16} />
                  Download
                </a>
              ) : (
                <span className="text-gray-500">None</span>
              )}
            </div>

            <div>
              <span className="text-gray-400 text-sm block">Thank You</span>
              {d.thank_you_sent ? (
                <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-md">
                  Sent
                </span>
              ) : (
                <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-md">
                  Not Sent
                </span>
              )}
            </div>
          </div>
        ))}

        {deliveries.length === 0 && (
          <p className="text-center text-gray-500 py-4">No deliveries found.</p>
        )}
      </div>
    </div>
  );
}
