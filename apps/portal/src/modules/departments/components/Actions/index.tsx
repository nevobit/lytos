import { Menus, useModal } from '@lytos/design-system'
import styles from './Actions.module.css';
import { Edit3, MoreHorizontal, Trash2 } from 'lucide-react';
import type { Department } from '@lytos/contracts';
import DepartmentFormModal from '../DepartmentFormModal';
import { useDeleteDepartment } from '../../hooks/useDeleteDepartment';
import { useUpdateDepartment } from '../../hooks/useUpdateDepartment';
import { useUsers } from '@/modules/auth/hooks';

const Actions = ({ id, department }: { id: string, department: Partial<Department> }) => {
    const { openModal, requestCloseModal } = useModal();
    const { deleteFn } = useDeleteDepartment();
    const { update } = useUpdateDepartment();
    const { users } = useUsers();

    const handleOpenEdit = (department: Partial<Department>) => {
        openModal(
            <DepartmentFormModal
                mode="edit"
                isLoading={false}
                initialValues={department}
                onSubmit={(values) => update({ id: String(department.id), ...values })}
                users={users}
            />
        );
    };

    const handleDelete = (department: Partial<Department>) => {
        requestCloseModal({
            confirm: true,
            onConfirm: () => deleteFn(String(department.id)),
            title: "Eliminar departamento",
            description: `Se eliminará "${department.name ?? "este departamento"}". Esta acción no se puede deshacer.`,
            confirmLabel: "Eliminar",
            cancelLabel: "Cancelar",
        });
    };

    return (
        <div className={styles.rowActions}>
            <Menus>
                <Menus.Menu>
                    <Menus.Toggle id={`department-actions-${id}`} className={styles.actionToggle}>
                        <MoreHorizontal strokeWidth="1.5px" size={18} />
                    </Menus.Toggle>

                    <Menus.List id={`department-actions-${id}`}>
                        <Menus.Item
                            id={`edit-${id}`}
                            leadingIcon={<Edit3 size={14} strokeWidth="1.5px" />}
                            onClick={() => handleOpenEdit(department)}
                        >
                            Editar
                        </Menus.Item>

                        <Menus.Divider />

                        <Menus.Item
                            id={`delete-${id}`}
                            leadingIcon={<Trash2 size={14} strokeWidth="1.5px" />}
                            danger
                            onClick={() => handleDelete(department)}
                        >
                            Eliminar
                        </Menus.Item>
                    </Menus.List>
                </Menus.Menu>
            </Menus>
        </div>
    )
}

export default Actions