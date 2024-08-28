// src/components/Card/Card.js
import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Link from 'next/link';
import styles from './Card.module.css';

export default function ReportCard({ title, description, link, params }) {
    const header = (
        <img className={styles.image} alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
    );

    const footer = (
        <Link href={{ pathname: link, query: params }} passHref>
            <Button className={styles.button} label="Ver Reporte" icon="pi pi-arrow-right" />
        </Link>
    );

    return (
        <div className="card flex justify-content-center">
            <Card title={title} footer={footer} header={header} className={styles.card}>
                <p className="m-0">
                    {description}
                </p>
            </Card>
        </div>
    );
}