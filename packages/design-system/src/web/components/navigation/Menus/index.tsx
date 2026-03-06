import React from "react";
import { createPortal } from "react-dom";
import styles from "./Menus.module.css";
import { useId } from "../../../../hooks/useId";
import { cx } from "../../../../utils";

type Placement = "bottom-start" | "bottom-end" | "top-start" | "top-end";

const MENU_ROOT_ATTR = "data-ds-menu-root";

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mounted, setMounted] = React.useState(false);

    const portalEl = React.useMemo(() => {
        if (typeof document === "undefined") return null;
        const el = document.createElement("div");
        el.setAttribute("data-ds-portal", "menu");
        el.setAttribute(MENU_ROOT_ATTR, "true");
        return el;
    }, []);

    React.useEffect(() => {
        if (!portalEl || typeof document === "undefined") return;

        document.body.appendChild(portalEl);
        setMounted(true);

        return () => {
            document.body.removeChild(portalEl);
        };
    }, [portalEl]);

    if (!mounted || !portalEl) return null;
    return createPortal(children, portalEl);
};

interface Ctx {
    openId: string | null;
    setOpenId: React.Dispatch<React.SetStateAction<string | null>>;
    anchorRect: DOMRect | null;
    setAnchorRect: React.Dispatch<React.SetStateAction<DOMRect | null>>;
    placement: Placement;
    setPlacement: React.Dispatch<React.SetStateAction<Placement>>;
    registerItem: (menuId: string, itemId: string, el: HTMLButtonElement | null) => void;
    unregisterItem: (menuId: string, itemId: string) => void;
    getItemsForMenu: (menuId: string) => string[];
    getElementsForMenu: (menuId: string) => Record<string, HTMLButtonElement | null>;
    closeAll: () => void;
    restoreFocus: () => void;
}

const MenusContext = React.createContext<Ctx | null>(null);

const useMenus = () => {
    const ctx = React.useContext(MenusContext);
    if (!ctx) throw new Error("Menus components must be used inside <Menus>");
    return ctx;
};

export interface MenusProps {
    children: React.ReactNode;
    defaultPlacement?: Placement;
}

export const Menus: React.FC<MenusProps> & {
    Menu: typeof Menu;
    Toggle: typeof Toggle;
    List: typeof List;
    Item: typeof Item;
    Divider: typeof Divider;
    Label: typeof Label;
} = ({ children, defaultPlacement = "bottom-end" }) => {
    const [openId, setOpenId] = React.useState<string | null>(null);
    const [anchorRect, setAnchorRect] = React.useState<DOMRect | null>(null);
    const [placement, setPlacement] = React.useState<Placement>(defaultPlacement);

    const itemsOrderRef = React.useRef<Record<string, string[]>>({});
    const elementsRef = React.useRef<Record<string, Record<string, HTMLButtonElement | null>>>({});
    const lastToggleRef = React.useRef<HTMLElement | null>(null);

    const registerItem = React.useCallback((menuId: string, itemId: string, el: HTMLButtonElement | null) => {
        if (!elementsRef.current[menuId]) {
            elementsRef.current[menuId] = {};
        }
        if (!itemsOrderRef.current[menuId]) {
            itemsOrderRef.current[menuId] = [];
        }

        elementsRef.current[menuId][itemId] = el;

        if (!itemsOrderRef.current[menuId].includes(itemId)) {
            itemsOrderRef.current[menuId].push(itemId);
        }
    }, []);

    const unregisterItem = React.useCallback((menuId: string, itemId: string) => {
        if (elementsRef.current[menuId]) {
            delete elementsRef.current[menuId][itemId];
        }

        if (itemsOrderRef.current[menuId]) {
            itemsOrderRef.current[menuId] = itemsOrderRef.current[menuId].filter((id) => id !== itemId);
        }
    }, []);

    const getItemsForMenu = React.useCallback((menuId: string) => {
        return itemsOrderRef.current[menuId] ?? [];
    }, []);

    const getElementsForMenu = React.useCallback((menuId: string) => {
        return elementsRef.current[menuId] ?? {};
    }, []);

    const closeAll = React.useCallback(() => {
        setOpenId(null);
        setAnchorRect(null);
    }, []);

    const restoreFocus = React.useCallback(() => {
        lastToggleRef.current?.focus();
    }, []);

    const value: Ctx = {
        openId,
        setOpenId,
        anchorRect,
        setAnchorRect,
        placement,
        setPlacement,
        registerItem,
        unregisterItem,
        getItemsForMenu,
        getElementsForMenu,
        closeAll,
        restoreFocus,
    };

    React.useEffect(() => {
        if (openId == null) return;

        const onDocPointerDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;

            const isInsideMenu = Boolean(target.closest(`[${MENU_ROOT_ATTR}="true"]`));
            if (isInsideMenu) return;

            closeAll();
        };

        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeAll();
                restoreFocus();
            }
        };

        document.addEventListener("mousedown", onDocPointerDown, true);
        document.addEventListener("keydown", onEsc, true);

        return () => {
            document.removeEventListener("mousedown", onDocPointerDown, true);
            document.removeEventListener("keydown", onEsc, true);
        };
    }, [openId, closeAll, restoreFocus]);

    return (
        <MenusContext.Provider value={value}>
            <div data-ds-menu-root="true" className={styles.scope}>
                {React.Children.map(children, (child) =>
                    React.isValidElement(child)
                        ? React.cloneElement(
                            child as React.ReactElement<{
                                __setLastToggleRef: (e: HTMLElement | null) => void;
                            }>,
                            {
                                __setLastToggleRef: (el: HTMLElement | null) => {
                                    lastToggleRef.current = el;
                                },
                            }
                        )
                        : child
                )}
            </div>
        </MenusContext.Provider>
    );
};

const Menu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className={styles.menu}>{children}</div>;
};

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    id: string;
    verticalIcon?: boolean;
    __setLastToggleRef?: (el: HTMLElement | null) => void;
}

const Toggle: React.FC<ToggleProps> = ({
    id,
    verticalIcon = false,
    className,
    children,
    __setLastToggleRef,
    ...rest
}) => {
    const { openId, setOpenId, setAnchorRect, closeAll } = useMenus();
    const btnRef = React.useRef<HTMLButtonElement | null>(null);
    const listId = useId(`${id}-list`);
    const isOpen = openId === id;

    const open = (rect: DOMRect) => {
        setAnchorRect(rect);
        setOpenId(id);
    };

    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        const btn = btnRef.current;
        if (!btn) return;

        const rect = btn.getBoundingClientRect();

        if (isOpen) {
            closeAll();
        } else {
            open(rect);
            btn.focus();
        }
    };

    React.useEffect(() => {
        __setLastToggleRef?.(btnRef.current);
    }, [__setLastToggleRef]);

    return (
        <button
            {...rest}
            ref={btnRef}
            type="button"
            className={cx(styles.toggle, className)}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            aria-controls={isOpen ? listId : undefined}
            onClick={onClick}
        >
            {children ?? (
                <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    aria-hidden="true"
                    focusable="false"
                >
                    {verticalIcon ? (
                        <g fill="currentColor">
                            <circle cx="12" cy="5" r="2.2" />
                            <circle cx="12" cy="12" r="2.2" />
                            <circle cx="12" cy="19" r="2.2" />
                        </g>
                    ) : (
                        <g fill="currentColor">
                            <circle cx="5" cy="12" r="2.2" />
                            <circle cx="12" cy="12" r="2.2" />
                            <circle cx="19" cy="12" r="2.2" />
                        </g>
                    )}
                </svg>
            )}
        </button>
    );
};

interface ListProps {
    id: string;
    children: React.ReactNode;
    placement?: Placement;
    maxHeight?: number;
}

const List: React.FC<ListProps> = ({ id, children, placement, maxHeight = 320 }) => {
    const {
        openId,
        anchorRect,
        setPlacement,
        placement: currentPlacement,
        getItemsForMenu,
        getElementsForMenu,
        closeAll,
        restoreFocus,
    } = useMenus();

    const ulRef = React.useRef<HTMLUListElement | null>(null);
    const listHtmlId = useId(`${id}-list`);
    const isOpen = openId === id;

    React.useEffect(() => {
        if (placement) setPlacement(placement);
    }, [placement, setPlacement]);

    React.useEffect(() => {
        if (!isOpen) return;

        const el = ulRef.current;
        if (!el) return;

        const items = getItemsForMenu(id);
        const elements = getElementsForMenu(id);

        if (items.length > 0) {
            elements[items[0] as string]?.focus();
        }

        const onKey = (e: KeyboardEvent) => {
            const currentItems = getItemsForMenu(id);
            const currentElements = getElementsForMenu(id);

            if (currentItems.length === 0) return;

            const idx = currentItems.findIndex((key) => currentElements[key] === document.activeElement);

            if (e.key === "ArrowDown") {
                e.preventDefault();
                const next = currentElements[idx]
                //  const next = currentElements[currentItems[(idx + 1 + currentItems.length) % currentItems.length]];
                next?.focus();
            // } else if (e.key === "ArrowUp") {
            //     e.preventDefault();
            //     const prev =
            //         currentElements[
            //         currentItems[(idx - 1 + currentItems.length) % currentItems.length]
            //         ];
            //     prev?.focus();
            // } else if (e.key === "Home") {
            //     e.preventDefault();
            //     currentElements[currentItems[0]]?.focus();
            // } else if (e.key === "End") {
            //     e.preventDefault();
            //     currentElements[currentItems[currentItems.length - 1]]?.focus();
            // } else if (e.key === "Escape") {
            //     e.preventDefault();
            //     closeAll();
            //     restoreFocus();
            }
        };

        el.addEventListener("keydown", onKey);
        return () => el.removeEventListener("keydown", onKey);
    }, [isOpen, id, getItemsForMenu, getElementsForMenu, closeAll, restoreFocus]);

    if (!isOpen || !anchorRect) return null;

    const style = computePosition(anchorRect, currentPlacement, 8);

    return (
        <Portal>
            <ul
                id={listHtmlId}
                role="menu"
                className={styles.list}
                ref={ulRef}
                style={{ ...style, maxHeight }}
                data-placement={currentPlacement}
                data-ds-menu-root="true"
            >
                {children}
            </ul>
        </Portal>
    );
};

export interface ItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    id: string;
    inset?: boolean;
    danger?: boolean;
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
}

const Item: React.FC<ItemProps> = ({
    id,
    inset,
    danger,
    leadingIcon,
    trailingIcon,
    className,
    onClick,
    ...rest
}) => {
    const { openId, registerItem, unregisterItem, closeAll } = useMenus();
    const ref = React.useRef<HTMLButtonElement | null>(null);

    React.useEffect(() => {
        if (!openId) return;

        registerItem(openId, id, ref.current);

        return () => {
            unregisterItem(openId, id);
        };
    }, [openId, id, registerItem, unregisterItem]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        closeAll();
    };

    return (
        <li role="none">
            <button
                ref={ref}
                role="menuitem"
                type="button"
                className={cx(styles.item, inset && styles.inset, danger && styles.danger, className)}
                onClick={handleClick}
                {...rest}
            >
                {leadingIcon && (
                    <span className={styles.leading} aria-hidden="true">
                        {leadingIcon}
                    </span>
                )}

                <span className={styles.label}>{rest.children}</span>

                {trailingIcon && (
                    <span className={styles.trailing} aria-hidden="true">
                        {trailingIcon}
                    </span>
                )}
            </button>
        </li>
    );
};

const Divider: React.FC = () => <li role="separator" className={styles.divider} />;

const Label: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
    <li role="presentation" className={styles.labelRow}>
        <div className={cx(styles.sectionLabel, className)} {...rest} />
    </li>
);

function computePosition(rect: DOMRect, placement: Placement, offset = 8): React.CSSProperties {
    const base: React.CSSProperties = {
        position: "fixed",
        zIndex: "var(--ds-z-dropdown)" as string | undefined,
    };

    const w = rect.width;
    const h = rect.height;

    switch (placement) {
        case "bottom-end":
            return {
                ...base,
                top: rect.y + h + offset,
                left: Math.max(8, rect.x + w - 240),
                right: "auto",
            };
        case "bottom-start":
            return {
                ...base,
                top: rect.y + h + offset,
                left: Math.max(8, rect.x),
                right: "auto",
            };
        case "top-end":
            return {
                ...base,
                top: Math.max(8, rect.y - offset),
                left: Math.max(8, rect.x + w - 240),
                transform: "translateY(-100%)",
            };
        case "top-start":
            return {
                ...base,
                top: Math.max(8, rect.y - offset),
                left: Math.max(8, rect.x),
                transform: "translateY(-100%)",
            };
        default:
            return {
                ...base,
                top: rect.y + h + offset,
                left: Math.max(8, rect.x + w - 240),
            };
    }
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Item = Item;
Menus.Divider = Divider;
Menus.Label = Label;

export default Menus;