import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function useMaintenance() {
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await api.get("https://cre8tlystudio.com/api/admin/settings/maintenance");
        setMaintenance(res.data.maintenance);
      } catch {
        setMaintenance(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  return { maintenance, loading };
}
