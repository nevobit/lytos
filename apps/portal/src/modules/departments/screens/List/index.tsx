import { Table, type DataTableColumn } from '@lytos/design-system';
import { useDepartments } from '../../hooks/useDepartments'
import type { Department } from '@lytos/contracts';
import styles from './List.module.css';
// import { ChevronDown } from 'lucide-react';

type Row = Partial<Department>;


function formatCLDateTime(input?: string | Date | null): string {
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

const columns: DataTableColumn<Row>[] = [
    { key: "name", header: "Nombre", sortable: true },
    {
        key: "createdAt",
        header: "Fecha de solicitud",
        sortable: true,
        render: (value) => <span className={styles.date}>{formatCLDateTime((value as string))}</span>,
    }];

const Departments = () => {
    const { departments } = useDepartments();
    return (
        <div>
            <div className={styles.header}>
                <div className={styles.titleBlock}>
                    <div className={styles.title}>Departamentos</div>
                    <div className={styles.subtitle}>0 departamentos</div>
                </div>

                <div className={styles.headerActions}>
                    <div className={styles.splitBtn}>
                        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`}>
                            Agregar departamento
                        </button>
                        {/* <button type="button" className={`${styles.btn} ${styles.btnPrimary} ${styles.splitBtnRight}`} aria-label="Abrir menú">
                            <ChevronDown size={16} strokeWidth="1.5px" />
                        </button> */}
                    </div>
                </div>
            </div>

            <Table columns={columns} rows={departments?.items || []} />
        </div>
    )
}

export default Departments