import { Table, type DataTableColumn } from '@lytos/design-system';
import { useDepartments } from '../../hooks/useDepartments'
import type { Department } from '@lytos/contracts';

const columns: DataTableColumn<Partial<Department>>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "createdAt", header: "Fecha de creacion", sortable: true },
];

const Departments = () => {
    const { departments } = useDepartments();
    return (
        <div>
            <Table columns={columns} rows={departments?.items || []} />
        </div>
    )
}

export default Departments