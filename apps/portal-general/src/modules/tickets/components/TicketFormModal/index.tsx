import React from "react";
import { Button, Input, Modal, Select, Textarea, useForm, useModal } from "@lytos/design-system";
import type { Customer, Ticket, TicketPriority, TicketType, User } from "@lytos/contracts";
import styles from "./TicketFormModal.module.css";

type TicketFormModalProps = {
    mode: "create" | "edit";
    initialValues?: Partial<Ticket> | null;
    isSubmitting?: boolean;
    onSubmit: (values: Partial<Ticket>) => Promise<void> | void;
    isLoading: boolean;
    users: User[]
    ticketPriorities: TicketPriority[]
    ticketTypes: TicketType[]
    customers: Customer[]
};

const TicketFormModal = ({
    mode,
    initialValues,
    isSubmitting = false,
    onSubmit,
    isLoading,
    users,
    ticketPriorities,
    ticketTypes,
    customers
}: TicketFormModalProps) => {
    const { closeModal, requestCloseModal } = useModal();
    const { formState: ticket, handleChange } = useForm<Partial<Ticket> | null | undefined>(initialValues);
    const [submitting, setSubmitting] = React.useState(false);

    const initialFocusRef = React.useRef<HTMLInputElement>(null);

    const handleClose = () => {
        requestCloseModal({
            // confirm: dirty,
            onConfirm: closeModal,
            title: mode === "create" ? "Descartar nuevo departamento" : "Descartar cambios",
            description:
                mode === "create"
                    ? "Se perderá la información del nuevo departamento."
                    : "Se perderán los cambios realizados en este departamento.",
            confirmLabel: "Descartar",
            cancelLabel: "Seguir editando",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);

            await onSubmit({
                ...ticket,
                source: {
                    channel: 'manual'
                }
            });

        } catch (error) {
            console.error("Error saving department:", error);
        } finally {
            setSubmitting(false);
            closeModal();
        }
    };

    const disabled = isSubmitting || submitting;

    return (
        <Modal.Window
            isOpen
            onClose={closeModal}
            onRequestClose={handleClose}
            closeStrategy="manual"
            size="md"
            ariaLabel={mode === "create" ? "Crear departamento" : "Editar departamento"}
            initialFocusRef={initialFocusRef as React.RefObject<HTMLElement>}
        >
            <Modal.Header className={styles.header}>
                <div>
                    <h2 className={styles.title}>
                        {mode === "create" ? "Nuevo ticket" : "Editar ticket"}
                    </h2>
                    <p className={styles.copy}>
                        {mode === "create"
                            ? "Configura la estructura base del ticket."
                            : "Actualiza la configuración del ticket."}
                    </p>
                </div>

                <Modal.CloseButton onClick={handleClose} label="Cerrar modal" />
            </Modal.Header>

            <form onSubmit={handleSubmit}>
                <Modal.Body className={styles.body}>
                    <div className={styles.grid}>
                        <Input
                            label="Titulo"
                            ref={initialFocusRef}
                            name="title"
                            id="ticket-title"
                            className={`${styles.input}`}
                            value={ticket?.title}
                            onChange={handleChange}
                            placeholder="Ej. Soporte"
                            maxLength={80}
                        />
                    </div>

                    <div>
                        <Select name="priorityId" onChange={handleChange} label="Prioridad">
                            <option value="">Seleccionar</option>
                            {ticketPriorities?.map((ticket) => (
                                <option key={ticket.id} value={ticket.id}>{ticket.name}</option>
                            ))}
                        </Select>

                        <Select name="categoryId" onChange={handleChange} label="Tipo de Ticket">
                            <option value="baja">Seleccionar</option>
                            {ticketTypes.map((ticket) => (
                                <option value={ticket.id}>{ticket.name}</option>
                            ))}
                        </Select>

                        <div className={styles.col}>
                            <Select name="customerId" onChange={handleChange} label="Solicitante">
                                <option value="baja">Seleccionar</option>
                                {customers.map((customer) => (
                                    <option value={customer.id}>{customer.name}</option>
                                ))}

                            </Select>

                            <Select name="assigneeMembershipId" onChange={handleChange} label="Responsable">
                                <option value="">Seleccionar</option>
                                {users?.map((user: User) => (
                                    <option value={user.id}>{user.name}</option>
                                ))}
                            </Select>
                        </div>

                        <Textarea label="Descripcion" name="description" onChange={handleChange} />
                    </div>



                </Modal.Body>

                <Modal.Footer className={styles.footer}>
                    <button
                        type="button"
                        className={styles.btn}
                        onClick={handleClose}
                        disabled={disabled}
                    >
                        Cancelar
                    </button>

                    <Button
                        type="submit"
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        disabled={disabled}
                        loading={isLoading}
                    >
                        {disabled
                            ? mode === "create"
                                ? "Creando..."
                                : "Guardando..."
                            : mode === "create"
                                ? "Crear ticket"
                                : "Guardar cambios"}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal.Window>
    );
};

export default TicketFormModal;