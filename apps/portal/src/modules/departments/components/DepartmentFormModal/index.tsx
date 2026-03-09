import React from "react";
import { Button, Input, Modal, Select, Textarea, useModal } from "@lytos/design-system";
import type { Department, User } from "@lytos/contracts";
import styles from "./DepartmentFormModal.module.css";

type DepartmentFormValues = {
    name: string;
    slug: string;
    description: string;
    isDefault: boolean;
    leadMembershipIds: string[];
    primaryLeadMembershipId?: User | string;
};

type DepartmentFormModalProps = {
    mode: "create" | "edit";
    initialValues?: Partial<Department> | null;
    isSubmitting?: boolean;
    onSubmit: (values: DepartmentFormValues) => Promise<void> | void;
    isLoading: boolean;
    users: User[];
};

function toSlug(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

const DepartmentFormModal = ({
    mode,
    initialValues,
    isSubmitting = false,
    onSubmit,
    isLoading,
    users
}: DepartmentFormModalProps) => {
    const { closeModal, requestCloseModal } = useModal();

    const [form, setForm] = React.useState<DepartmentFormValues>({
        name: initialValues?.name ?? "",
        slug: initialValues?.slug ?? "",
        description: initialValues?.description ?? "",
        isDefault: initialValues?.isDefault ?? false,
        leadMembershipIds: initialValues?.leadMembershipIds ?? [],
        primaryLeadMembershipId: initialValues?.primaryLeadMembershipId,
    });

    const [errors, setErrors] = React.useState<
        Partial<Record<keyof DepartmentFormValues, string>>
    >({});
    const [touched, setTouched] = React.useState<Record<string, boolean>>({});
    const [submitting, setSubmitting] = React.useState(false);
    const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(
        Boolean(initialValues?.slug)
    );

    const initialFocusRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (slugManuallyEdited) return;
        setForm((prev) => ({
            ...prev,
            slug: toSlug(prev.name),
        }));
    }, [form.name, slugManuallyEdited]);

    const dirty = React.useMemo(() => {
        return (
            form.name !== (initialValues?.name ?? "") ||
            form.slug !== (initialValues?.slug ?? "") ||
            form.description !== (initialValues?.description ?? "") ||
            form.isDefault !== (initialValues?.isDefault ?? false)
        );
    }, [form, initialValues]);

    const validate = React.useCallback(() => {
        const nextErrors: Partial<Record<keyof DepartmentFormValues, string>> = {};

        if (!form.name.trim()) {
            nextErrors.name = "El nombre es obligatorio.";
        } else if (form.name.trim().length < 2) {
            nextErrors.name = "El nombre debe tener al menos 2 caracteres.";
        } else if (form.name.trim().length > 80) {
            nextErrors.name = "El nombre no debe superar los 80 caracteres.";
        }

        if (!form.slug.trim()) {
            nextErrors.slug = "El slug es obligatorio.";
        } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())) {
            nextErrors.slug =
                "El slug solo puede contener letras minúsculas, números y guiones.";
        } else if (form.slug.trim().length < 2) {
            nextErrors.slug = "El slug debe tener al menos 2 caracteres.";
        } else if (form.slug.trim().length > 80) {
            nextErrors.slug = "El slug no debe superar los 80 caracteres.";
        }

        if (form.description.trim().length > 300) {
            nextErrors.description = "La descripción no debe superar los 300 caracteres.";
        }

        if (
            form.primaryLeadMembershipId &&
            !form.leadMembershipIds.includes(form.primaryLeadMembershipId as string)
        ) {
            nextErrors.primaryLeadMembershipId =
                "El líder principal debe existir dentro de los responsables seleccionados.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }, [form]);

    const handleChange =
        (field: keyof DepartmentFormValues) =>
            (
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
                const target = e.target;
                const value =
                    target instanceof HTMLInputElement && target.type === "checkbox"
                        ? target.checked
                        : target.value;

                setForm((prev) => ({
                    ...prev,
                    [field]: value,
                }));
            };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm((prev) => ({
            ...prev,
            name: value,
            slug: slugManuallyEdited ? prev.slug : toSlug(value),
        }));
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlugManuallyEdited(true);
        setForm((prev) => ({
            ...prev,
            slug: toSlug(e.target.value),
        }));
    };

    const handleLeadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForm((prev) => ({
            ...prev,
            leadMembershipIds: [e.target.value],
            primaryLeadMembershipId: e.target.value,
        }));
    };

    const handleBlur = (field: keyof DepartmentFormValues) => () => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        validate();
    };

    const handleClose = () => {
        requestCloseModal({
            confirm: dirty,
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

        if (!validate()) return;

        try {
            setSubmitting(true);

            await onSubmit({
                name: form.name.trim(),
                slug: form.slug.trim(),
                description: form.description.trim(),
                isDefault: form.isDefault,
                leadMembershipIds: form.leadMembershipIds,
                primaryLeadMembershipId: form.primaryLeadMembershipId,
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
                        {mode === "create" ? "Nuevo departamento" : "Editar departamento"}
                    </h2>
                    <p className={styles.copy}>
                        {mode === "create"
                            ? "Configura la estructura base del departamento."
                            : "Actualiza la configuración del departamento."}
                    </p>
                </div>

                <Modal.CloseButton onClick={handleClose} label="Cerrar modal" />
            </Modal.Header>

            <form onSubmit={handleSubmit}>
                <Modal.Body className={styles.body}>
                    <div className={styles.grid}>
                        <Input
                            label="Nombre"
                            ref={initialFocusRef}
                            id="department-name"
                            className={`${styles.input} ${touched.name && errors.name ? styles.inputError : ""
                                }`}
                            value={form.name}
                            onChange={handleNameChange}
                            onBlur={handleBlur("name")}
                            placeholder="Ej. Soporte"
                            maxLength={80}
                            error={touched.name && errors.name ? errors.name : ''}
                        />

                        <Input
                            label="Slug"
                            id="department-slug"
                            className={`${styles.input} ${touched.slug && errors.slug ? styles.inputError : ""
                                }`}
                            value={form.slug}
                            onChange={handleSlugChange}
                            onBlur={handleBlur("slug")}
                            placeholder="soporte"
                            maxLength={80}
                            hint="Identificador técnico para URLs, integraciones o reglas internas."
                            error={touched.slug && errors.slug ? errors.slug : ''}
                        />
                        <Select label="Responsable"
                            id="department-lead"
                            className={`${styles.input} ${touched.slug && errors.slug ? styles.inputError : ""
                                }`}
                            value={form.primaryLeadMembershipId as string}
                            onChange={handleLeadChange}
                            hint="Encargado del departamento y primer contacto.">
                            <option>Seleccionar usuario</option>

                            {users?.map((user: User) => (
                                <option value={user.id}>{user.name}</option>

                            ))}
                        </Select >
                    </div>

                    <Textarea
                        label="Descripción"
                        id="department-description"
                        className={`${styles.textarea} ${touched.description && errors.description ? styles.inputError : ""
                            }`}
                        value={form.description}
                        onChange={handleChange("description")}
                        onBlur={handleBlur("description")}
                        placeholder="Describe brevemente el propósito del departamento."
                        rows={4}
                        maxLength={300}
                        error={touched.description && errors.description ? errors.description : ''}

                        hint={`Opcional, pero útil.   ${form.description.length} /300`}
                    />

                    <div className={styles.checkboxRow}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={form.isDefault}
                                onChange={handleChange("isDefault")}
                            />
                            <span>Marcar como departamento por defecto</span>
                        </label>
                        <p className={styles.hint}>
                            Úsalo solo si este será el departamento base para nuevas asignaciones.
                        </p>
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
                        disabled={disabled}
                        loading={isLoading}
                    >
                        {disabled
                            ? mode === "create"
                                ? "Creando..."
                                : "Guardando..."
                            : mode === "create"
                                ? "Crear departamento"
                                : "Guardar cambios"}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal.Window>
    );
};

export default DepartmentFormModal;