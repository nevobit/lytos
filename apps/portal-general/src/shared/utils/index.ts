
export function formatCLDateTime(input?: string | Date | null): string {
    if (!input) return "—";
    const d = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(d.getTime())) return "—";

    const date = d.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    const time = d.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return `${date}, ${time}`;
}