'use client'

import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import styles from './page.module.css';
import ChequesResumen from '../../%Components/TablasComparativasNomina/ChequesResumen';
import Retensiones from '../../%Components/TablasComparativasNomina/Retenciones';
import DepositoResumen from '../../%Components/TablasComparativasNomina/DepositoResumen';
import RetensionesDeposito from '../../%Components/TablasComparativasNomina/RetencionesDeposito';
import Totales from '../../%Components/TablasComparativasNomina/Totales';
import ImporteLiquido from '../../%Components/TablasComparativasNomina/ImporteLiquido';

const SortableItem = ({ id, className, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className={className}>
            <div className={styles.dragHandle} {...attributes} {...listeners}>
                <DragIndicatorIcon className={styles.dragIcon} />
            </div>
            {children}
        </div>
    );
};

const CargarDatos = () => {
    const [components, setComponents] = useState([
        { id: 'chequesResumen', component: <ChequesResumen />, className: styles.gridItem1 },
        { id: 'retensiones', component: <Retensiones />, className: styles.gridItem2 },
        { id: 'depositoResumen', component: <DepositoResumen />, className: styles.gridItem1 },
        { id: 'retensionesDeposito', component: <RetensionesDeposito />, className: styles.gridItem2 },
        { id: 'totales', component: <Totales />, className: styles.gridItem1 },
        { id: 'importeLiquido', component: <ImporteLiquido />, className: styles.gridItem2 },
    ]);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setComponents((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <main className={styles.main}>
            <h1 className={styles.h1}>Procesar datos</h1>
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={components.map((item) => item.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className={styles.grid}>
                        {components.map((item) => (
                            <SortableItem key={item.id} id={item.id} className={item.className}>
                                {item.component}
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </main>
    );
};

export default CargarDatos;
