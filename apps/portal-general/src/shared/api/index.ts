import axios, { AxiosError, type AxiosInstance } from "axios";
import CryptoJS from "crypto-js";
import { useSession } from "../state-manager";

const API_KEY = import.meta.env.VITE_API_KEY;
const SECRET = import.meta.env.VITE_API_SECRET;


function stableStringify(obj: unknown): string {
    if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
    if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;
    return `{${Object.keys(obj).sort()
        .map(k => `"${k}":${stableStringify((obj as Record<string, unknown>)[k])}`)
        .join(",")}}`;
}

function signRequest(method: string, path: string, body: unknown, timestamp: string) {
    const bodyStr = body ? stableStringify(body) : "";
    const bodyHash = CryptoJS.SHA256(bodyStr).toString(CryptoJS.enc.Hex);
    const payload = `${method.toUpperCase()}\n${path}\n${timestamp}\n${bodyHash}`;
    return CryptoJS.HmacSHA256(payload, SECRET).toString(CryptoJS.enc.Hex);
}

export const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "/api",
    headers: { "Content-Type": "application/json" },
    timeout: 15000
});

api.interceptors.request.use(cfg => {
    const token = useSession.getState().token;
    const workspaceId = useSession.getState().workspace?.slug;

    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    const timestamp = Date.now().toString();

    const url = new URL(cfg.url ?? "", cfg.baseURL);
    const path = url.pathname + (url.search ?? "");

    const signature = signRequest(cfg.method ?? "GET", path, cfg.data, timestamp);
    cfg.headers["api-key"] = API_KEY;
    cfg.headers["x-client-user-agent"] = "Portal/1.0.0 (web)";
    cfg.headers["x-timestamp"] = timestamp;
    cfg.headers["x-path"] = `/api/v1${path}`;
    cfg.headers["x-signature"] = `sha256=${signature}`;
    cfg.headers["x-workspace"] = workspaceId;

    return cfg;
});

api.interceptors.response.use(
    res => res,
    (err: AxiosError<unknown>) => {
        if (err.response?.status === 401) {
            try { useSession.getState().signOut(); } catch { throw new Error('Error') }
        }
        const msg = (err.response?.data as unknown as { message: string })?.message || err.message || `HTTP ${err.response?.status ?? "ERR"}`;
        return Promise.reject(new Error(msg));
    }
);

export const getJSON = <T,>(url: string, opts?: { params?: unknown; signal?: AbortSignal; api?: AxiosInstance }) =>
    (opts?.api ?? api).get<T>(url, { params: opts?.params, signal: opts?.signal }).then(r => r.data);

export const postJSON = <T,>(url: string, body?: unknown, opts?: { signal?: AbortSignal; api?: AxiosInstance }) =>
    (opts?.api ?? api).post<T>(url, body, { signal: opts?.signal }).then(r => r.data);

export const putJSON = <T,>(url: string, body?: unknown, opts?: { signal?: AbortSignal; api?: AxiosInstance }) =>
    (opts?.api ?? api).put<T>(url, body, { signal: opts?.signal }).then(r => r.data);

export const delJSON = <T,>(url: string, opts?: { signal?: AbortSignal; api?: AxiosInstance }) =>
    (opts?.api ?? api).delete<T>(url, { signal: opts?.signal }).then(r => r.data);
