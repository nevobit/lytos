import React from "react";
import {
    Button,
    Input,
    Modal,
    Select,
    useModal,
} from "@lytos/design-system";
import type { Customer, User } from "@lytos/contracts";
import styles from "./CustomerFormModal.module.css";

type CustomerFormValues = {
    name: string;
    displayName: string;
    locale: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    userId: string;
    workspaceId: string;
};

type CustomerFormModalProps = {
    mode: "create" | "edit";
    initialValues?: Partial<Customer> | null;
    workspaceId: string;
    users: User[];
    isSubmitting?: boolean;
    isLoading: boolean;
    onSubmit: (values: CustomerFormValues) => Promise<void> | void;
};

function getPrimaryContact(
    items?: { value: string; primary: boolean }[]
): string {
    if (!items?.length) return "";
    return items.find((item) => item.primary)?.value ?? items[0]?.value ?? "";
}

const CustomerFormModal = ({
    mode,
    initialValues,
    workspaceId,
    users,
    isSubmitting = false,
    isLoading,
    onSubmit,
}: CustomerFormModalProps) => {
    const { closeModal, requestCloseModal } = useModal();

    const [form, setForm] = React.useState<CustomerFormValues>({
        name: initialValues?.name ?? "",
        displayName: initialValues?.displayName ?? "",
        locale: initialValues?.locale ?? "es-CO",
        email: getPrimaryContact(initialValues?.emails),
        phone: getPrimaryContact(initialValues?.phones),
        country: initialValues?.location?.country ?? "",
        city: initialValues?.location?.city ?? "",
        userId: initialValues?.userId ?? "",
        workspaceId: initialValues?.workspaceId ?? workspaceId,
    });

    const [errors, setErrors] = React.useState<
        Partial<Record<keyof CustomerFormValues, string>>
    >({});
    const [touched, setTouched] = React.useState<Record<string, boolean>>({});
    const [submitting, setSubmitting] = React.useState(false);

    const initialFocusRef = React.useRef<HTMLInputElement>(null);

    const dirty = React.useMemo(() => {
        return (
            form.name !== (initialValues?.name ?? "") ||
            form.displayName !== (initialValues?.displayName ?? "") ||
            form.locale !== (initialValues?.locale ?? "es-CO") ||
            form.email !== getPrimaryContact(initialValues?.emails) ||
            form.phone !== getPrimaryContact(initialValues?.phones) ||
            form.country !== (initialValues?.location?.country ?? "") ||
            form.city !== (initialValues?.location?.city ?? "") ||
            form.userId !== (initialValues?.userId ?? "") ||
            form.workspaceId !== (initialValues?.workspaceId ?? workspaceId)
        );
    }, [form, initialValues, workspaceId]);

    const validate = React.useCallback(() => {
        const nextErrors: Partial<Record<keyof CustomerFormValues, string>> = {};

        if (!form.name.trim()) {
            nextErrors.name = "El nombre es obligatorio.";
        } else if (form.name.trim().length < 2) {
            nextErrors.name = "El nombre debe tener al menos 2 caracteres.";
        } else if (form.name.trim().length > 80) {
            nextErrors.name = "El nombre no debe superar los 80 caracteres.";
        }

        if (!form.displayName.trim()) {
            nextErrors.displayName = "El nombre visible es obligatorio.";
        } else if (form.displayName.trim().length < 2) {
            nextErrors.displayName =
                "El nombre visible debe tener al menos 2 caracteres.";
        } else if (form.displayName.trim().length > 80) {
            nextErrors.displayName =
                "El nombre visible no debe superar los 80 caracteres.";
        }

        if (!form.locale.trim()) {
            nextErrors.locale = "El locale es obligatorio.";
        } else if (!/^[a-z]{2}-[A-Z]{2}$/.test(form.locale.trim())) {
            nextErrors.locale =
                "Usa un formato válido como es-CO, en-US o pt-BR.";
        }

        if (!form.email.trim()) {
            nextErrors.email = "El email es obligatorio.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim().toLowerCase())
        ) {
            nextErrors.email = "Ingresa un email válido.";
        }

        if (!form.phone.trim()) {
            nextErrors.phone = "El teléfono es obligatorio.";
        } else if (form.phone.trim().length < 7) {
            nextErrors.phone = "El teléfono parece demasiado corto.";
        } else if (form.phone.trim().length > 20) {
            nextErrors.phone = "El teléfono no debe superar los 20 caracteres.";
        }

        if (!form.country.trim()) {
            nextErrors.country = "El país es obligatorio.";
        } else if (form.country.trim().length > 80) {
            nextErrors.country = "El país no debe superar los 80 caracteres.";
        }

        if (!form.city.trim()) {
            nextErrors.city = "La ciudad es obligatoria.";
        } else if (form.city.trim().length > 80) {
            nextErrors.city = "La ciudad no debe superar los 80 caracteres.";
        }

        if (!form.userId.trim()) {
            nextErrors.userId = "Debes seleccionar un usuario asociado.";
        }

        if (!form.workspaceId.trim()) {
            nextErrors.workspaceId = "El workspace es obligatorio.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }, [form]);

    const handleChange =
        (field: keyof CustomerFormValues) =>
            (
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
                const value = e.target.value;

                setForm((prev) => ({
                    ...prev,
                    [field]: value,
                }));
            };

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForm((prev) => ({
            ...prev,
            userId: e.target.value,
        }));
    };

    const handleBlur = (field: keyof CustomerFormValues) => () => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        validate();
    };

    const handleClose = () => {
        requestCloseModal({
            confirm: dirty,
            onConfirm: closeModal,
            title: mode === "create" ? "Descartar nuevo cliente" : "Descartar cambios",
            description:
                mode === "create"
                    ? "Se perderá la información del nuevo cliente."
                    : "Se perderán los cambios realizados en este cliente.",
            confirmLabel: "Descartar",
            cancelLabel: "Seguir editando",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setTouched({
            name: true,
            displayName: true,
            locale: true,
            email: true,
            phone: true,
            country: true,
            city: true,
            userId: true,
            workspaceId: true,
        });

        if (!validate()) return;

        try {
            setSubmitting(true);

            await onSubmit({
                name: form.name.trim(),
                displayName: form.displayName.trim(),
                locale: form.locale.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                country: form.country.trim(),
                city: form.city.trim(),
                userId: form.userId.trim(),
                workspaceId: form.workspaceId.trim(),
            });

            closeModal();
        } catch (error) {
            console.error("Error saving customer:", error);
        } finally {
            setSubmitting(false);
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
            ariaLabel={mode === "create" ? "Crear cliente" : "Editar cliente"}
            initialFocusRef={initialFocusRef as React.RefObject<HTMLElement>}
        >
            <Modal.Header className={styles.header}>
                <div>
                    <h2 className={styles.title}>
                        {mode === "create" ? "Nuevo cliente" : "Editar cliente"}
                    </h2>
                    <p className={styles.copy}>
                        {mode === "create"
                            ? "Registra la información principal del cliente."
                            : "Actualiza la información principal del cliente."}
                    </p>
                </div>

                <Modal.CloseButton onClick={handleClose} label="Cerrar modal" />
            </Modal.Header>

            <form onSubmit={handleSubmit}>
                <Modal.Body className={styles.body}>
                    <div className={styles.grid}>
                        <Input
                            label="Nombre interno"
                            ref={initialFocusRef}
                            id="customer-name"
                            className={`${styles.input} ${touched.name && errors.name ? styles.inputError : ""
                                }`}
                            value={form.name}
                            onChange={handleChange("name")}
                            onBlur={handleBlur("name")}
                            placeholder="Ej. Empresa SAS"
                            maxLength={80}
                            error={touched.name && errors.name ? errors.name : ""}
                        />

                        <Input
                            label="Nombre visible"
                            id="customer-display-name"
                            className={`${styles.input} ${touched.displayName && errors.displayName
                                ? styles.inputError
                                : ""
                                }`}
                            value={form.displayName}
                            onChange={handleChange("displayName")}
                            onBlur={handleBlur("displayName")}
                            placeholder="Ej. Empresa"
                            maxLength={80}
                            hint="Nombre que verán los equipos o agentes en la interfaz."
                            error={
                                touched.displayName && errors.displayName
                                    ? errors.displayName
                                    : ""
                            }
                        />
                    </div>

                    <div className={styles.grid}>
                        <Input
                            label="Email principal"
                            id="customer-email"
                            className={`${styles.input} ${touched.email && errors.email ? styles.inputError : ""
                                }`}
                            value={form.email}
                            onChange={handleChange("email")}
                            onBlur={handleBlur("email")}
                            placeholder="cliente@empresa.com"
                            maxLength={120}
                            error={touched.email && errors.email ? errors.email : ""}
                        />

                        <Input
                            label="Teléfono principal"
                            id="customer-phone"
                            className={`${styles.input} ${touched.phone && errors.phone ? styles.inputError : ""
                                }`}
                            value={form.phone}
                            onChange={handleChange("phone")}
                            onBlur={handleBlur("phone")}
                            placeholder="+57 300 123 4567"
                            maxLength={20}
                            error={touched.phone && errors.phone ? errors.phone : ""}
                        />
                    </div>

                    <div className={styles.grid}>
                        <Input
                            label="País"
                            id="customer-country"
                            className={`${styles.input} ${touched.country && errors.country ? styles.inputError : ""
                                }`}
                            value={form.country}
                            onChange={handleChange("country")}
                            onBlur={handleBlur("country")}
                            placeholder="Colombia"
                            maxLength={80}
                            error={touched.country && errors.country ? errors.country : ""}
                        />

                        <Input
                            label="Ciudad"
                            id="customer-city"
                            className={`${styles.input} ${touched.city && errors.city ? styles.inputError : ""
                                }`}
                            value={form.city}
                            onChange={handleChange("city")}
                            onBlur={handleBlur("city")}
                            placeholder="Medellín"
                            maxLength={80}
                            error={touched.city && errors.city ? errors.city : ""}
                        />
                    </div>

                    <div className={styles.grid}>
                        <Input
                            label="Locale"
                            id="customer-locale"
                            className={`${styles.input} ${touched.locale && errors.locale ? styles.inputError : ""
                                }`}
                            value={form.locale}
                            onChange={handleChange("locale")}
                            onBlur={handleBlur("locale")}
                            placeholder="es-CO"
                            maxLength={10}
                            hint="Formato recomendado: idioma-PAÍS."
                            error={touched.locale && errors.locale ? errors.locale : ""}
                        />

                        <Select
                            label="Usuario asociado"
                            id="customer-user"
                            className={`${styles.input} ${touched.userId && errors.userId ? styles.inputError : ""
                                }`}
                            value={form.userId}
                            onChange={handleUserChange}
                            hint="Usuario relacionado con este cliente dentro del workspace."
                            error={touched.userId && errors.userId ? errors.userId : ""}
                        >
                            <option value="">Seleccionar usuario</option>
                            {users?.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name || user.email || user.id}
                                </option>
                            ))}
                        </Select>
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

                    <Button type="submit" disabled={disabled} loading={isLoading}>
                        {disabled
                            ? mode === "create"
                                ? "Creando..."
                                : "Guardando..."
                            : mode === "create"
                                ? "Crear cliente"
                                : "Guardar cambios"}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal.Window>
    );
};

export default CustomerFormModal;