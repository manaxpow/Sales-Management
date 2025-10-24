import { useEffect, useState, useCallback } from "react";
import type { AxiosError } from "axios";

type FetchService<TRequest, TResponse> = (
  req: TRequest
) => Promise<{ data?: TResponse }>;

export function useFetchData<TRequest, TResponse>(
  service: FetchService<TRequest, TResponse>,
  request: TRequest
) {
  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await service(request);
      if (res.data) setData(res.data);
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message || "Lỗi khi tải dữ liệu";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [service, JSON.stringify(request)]);

  const refetch = () => {
    console.log("sdfasdf");
    fetchData();
  };
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading, refetch };
}
