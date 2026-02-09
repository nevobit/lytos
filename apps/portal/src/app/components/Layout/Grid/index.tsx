import React from "react";
import styles from "./Grid.module.css";

type GridProps = {
    children: React.ReactNode;
};

export const Grid = ({ children }: GridProps) => {
    return <div className={styles.grid}>{children}</div>;
};

type ColProps = {
    span?: number;
    children: React.ReactNode;
};

export const Col = ({ span = 12, children }: ColProps) => {
    return (
        <div
            className={styles.col}
            style={{ gridColumn: `span ${span}` }}
        >
            {children}
        </div>
    );
};
