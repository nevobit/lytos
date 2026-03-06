import React from "react";
import { Button, Input, Modal, useForm, useModal } from "@lytos/design-system";
import type { Ticket } from "@lytos/contracts";
import styles from "./TicketFormModal.module.css";

type TicketFormModalProps = {
    mode: "create" | "edit";
    initialValues?: Partial<Ticket> | null;
    isSubmitting?: boolean;
    onSubmit: (values: Partial<Ticket>) => Promise<void> | void;
    isLoading: boolean;
};

const TicketFormModal = ({
    mode,
    initialValues,
    isSubmitting = false,
    onSubmit,
    isLoading,
}: TicketFormModalProps) => {
    const { closeModal, requestCloseModal } = useModal();
    const { formState: ticket, handleChange } = useForm<Partial<Ticket> | null | undefined>(initialValues);

    const [touched, setTouched] = React.useState<Record<string, boolean>>({});
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
        setTouched({
            name: true,
            slug: true,
            description: true,
            isDefault: true,
        });


        try {
            setSubmitting(true);

            await onSubmit({

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
                            className={`${styles.input} ${touched.name && errors.title ? styles.inputError : ""
                                }`}
                            value={ticket?.title}
                            onChange={handleChange}
                            placeholder="Ej. Soporte"
                            maxLength={80}
                        />
                    </div>

                    <div>
                        <span>Prioridad</span>
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