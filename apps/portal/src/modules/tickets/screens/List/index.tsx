import { Table, type DataTableColumn } from '@lytos/design-system';
import { useTickets } from '../../hooks/useTickets'
import type { Ticket } from '@lytos/contracts';

const columns: DataTableColumn<Partial<Ticket>>[] = [
    { key: "ticketNumber", header: "Ticket ID", sortable: true },
    { key: "subject", header: "Asunto", sortable: true },
    { key: "priorityId", header: "Prioridad" },
    { key: "categoryId", header: "Tipo" },
    { key: "customerId", header: "Cliente" },
    { key: "createdAt", header: "Fecha de solicitud" },
];

const Tickets = () => {
    const { tickets } = useTickets();
    return (
        <div>
            <Table columns={columns} rows={tickets?.items || []} />
        </div>
    )
}

export default Tickets