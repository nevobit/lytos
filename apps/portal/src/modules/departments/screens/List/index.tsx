import { Table, useModal, type DataTableColumn } from '@lytos/design-system';
import { useDepartments } from '../../hooks/useDepartments'
import type { DepartmentDto, User } from '@lytos/contracts';
import styles from './List.module.css';
import { Search } from 'lucide-react';
import { useState } from 'react';
import DepartmentFormModal from '../../components/DepartmentFormModal';
import Actions from '../../components/Actions';
import { useCreateDepartment } from '../../hooks/useCreateDepartment';
import { useUsers } from '@/modules/auth/hooks';
import { formatCLDateTime } from '@/shared/utils';

type Row = Partial<DepartmentDto>;

const columns: DataTableColumn<Row>[] = [
    { key: "name", header: "Nombre", sortable: true },
    {
        key: "primaryLeadMembershipId", header: "Responsable",
        render: (value) => <span>{(value as User)?.name}</span>,

    },
    {
        key: "createdAt",
        header: "Fecha de solicitud",
        sortable: true,
        render: (value) => <span className={styles.date}>{formatCLDateTime((value as string))}</span>,
    },
    {
        key: 'id',
        header: '',
        render: (value, row) => <Actions id={value as string} department={row} />
    }

];

const Departments = () => {
    const { departments } = useDepartments();
    const { users } = useUsers();

    const { openModal } = useModal();
    const { isLoading, create } = useCreateDepartment();

    const [query, setQuery] = useState("");

    const handleOpenCreate = () => {
        openModal(
            <DepartmentFormModal
                mode="create"
                onSubmit={create}
                isLoading={isLoading}
                users={users}
            />
        );
    }; 

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.titleBlock}>
                    <div className={styles.title}>Departamentos</div>
                    <div className={styles.copy}><strong>{departments?.items?.length}</strong> departamentos</div>
                </div>

                <div className={styles.headerActions}>
                    <div className={styles.splitBtn}>
                        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleOpenCreate} >
                            Agregar departamento
                        </button>
                        {/* <button type="button" className={`${styles.btn} ${styles.btnPrimary} ${styles.splitBtnRight}`} aria-label="Abrir menú">
                            <ChevronDown size={16} strokeWidth="1.5px" />
                        </button> */}
                    </div>
                </div>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.search}>
                    <Search size={14} strokeWidth='1.5px' />
                    <input
                        className={styles.searchInput}
                        placeholder="Buscar"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                </div>

                <div className={styles.filters}>
                </div>
            </div>

            <div className={styles.tableWrap} >
                <Table columns={columns} rows={departments?.items || []} />
            </div>
        </div>
    )
}

export default Departments