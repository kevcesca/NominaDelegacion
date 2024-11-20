"use client";

import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { Collapse } from "@mui/material";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import ColumnSelector from "../ColumnSelector/ColumnSelector";
import API_BASE_URL from "../../%Config/apiConfig";
import styles from "./TablaUsuarios.module.css";

export default function TablaEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [showTable, setShowTable] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const dt = useRef(null);
  const toast = useRef(null);

  const availableColumns = [
    { key: "nombre", label: "Nombre", defaultSelected: true },
    { key: "apellido1", label: "Apellido Paterno", defaultSelected: true },
    { key: "apellido2", label: "Apellido Materno", defaultSelected: true },
    { key: "curp", label: "CURP" },
    { key: "idLegal", label: "ID Legal" },
    { key: "idSexo", label: "Sexo" },
    { key: "numeroSs", label: "Número de Seguro Social" },
    { key: "colonia", label: "Colonia" },
    { key: "direccion", label: "Dirección" },
    { key: "codigoPostal", label: "Código Postal" },
    { key: "nPuesto", label: "Puesto" },
    { key: "activo", label: "Activo" },
    { key: "formaDePago", label: "Forma de Pago" },
  ];

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/empleados`);
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        // Transformar datos a camelCase
        const transformedData = data.map((item) => ({
          idEmpleado: item.id_empleado,
          nombre: item.nombre,
          apellido1: item.apellido_1,
          apellido2: item.apellido_2,
          curp: item.curp,
          idLegal: item.id_legal,
          idSexo: item.id_sexo,
          numeroSs: item.numero_ss,
          colonia: item.colonia,
          direccion: item.direccion,
          codigoPostal: item.codigo_postal,
          nPuesto: item.n_puesto,
          activo: item.activo,
          formaDePago: item.forma_de_pago,
        }));
        setEmpleados(transformedData);
      } catch (error) {
        console.error("Error fetching the empleados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmpleados();
  }, []);

  const handleRowClick = (rowData) => {
    setSelectedEmpleado(rowData);
    setIsDialogVisible(true);
  };

  const header = (
    <div className="flex justify-content-between align-items-center">
      <h2 className={styles.titulo}>TABLA EMPLEADOS</h2>
      <span
        className="p-input-icon-left"
        style={{ width: "400px", marginTop: "2rem" }}
      >
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
          style={{ width: "100%", marginLeft: "2rem" }}
        />
      </span>
    </div>
  );

  const empleadoDialogFooter = (
    <div className="flex justify-content-end">
      <button
        onClick={() => setIsDialogVisible(false)}
        className="p-button p-component p-button-text"
      >
        Cerrar
      </button>
    </div>
  );

  const handleColumnSelectionChange = (selectedColumns) => {
    setVisibleColumns(selectedColumns);
    setShowTable(true);
    setCollapseOpen(false);
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className={styles.dropForm}>
        <h3 className={styles.exportText}>Campos para generar tabla</h3>
        <Button
          type="button"
          icon={`pi ${collapseOpen ? "pi-chevron-up" : "pi-chevron-down"}`}
          severity="secondary"
          rounded
          onClick={() => setCollapseOpen(!collapseOpen)}
          data-pr-tooltip="Configurar columnas"
        />
      </div>

      <Toolbar
        className="mb-4"
        right={() => (
          <div className="flex align-items-center justify-content-end gap-2">
            <Button
              type="button"
              icon="pi pi-file"
              rounded
              onClick={() => console.log("Export CSV")}
              data-pr-tooltip="CSV"
            />
          </div>
        )}
      />

      <Collapse in={collapseOpen}>
        <div className="p-3">
          <ColumnSelector
            availableColumns={availableColumns}
            onSelectionChange={handleColumnSelectionChange}
          />
        </div>
      </Collapse>

      {isLoading ? (
        <ProgressBar mode="indeterminate" style={{ height: "6px" }} />
      ) : (
        showTable && (
          <DataTable
            ref={dt}
            value={empleados}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            dataKey="idEmpleado"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="idEmpleado"
              header="ID"
              sortable
              style={{ minWidth: "100px" }}
            ></Column>
            {availableColumns.map(
              (column) =>
                visibleColumns[column.key] && (
                  <Column
                    key={column.key}
                    field={column.key}
                    header={column.label}
                    sortable
                    style={{ minWidth: "150px" }}
                  />
                )
            )}
          </DataTable>
        )
      )}

      <Dialog
        header="Detalles del Empleado"
        visible={isDialogVisible}
        style={{ width: "50vw" }}
        modal
        footer={empleadoDialogFooter}
        onHide={() => setIsDialogVisible(false)}
      >
        {selectedEmpleado && (
          <div>
            {Object.entries(selectedEmpleado).map(([key, value]) => (
              <p key={key}>
                <strong>{key.replace(/([A-Z])/g, " $1").toUpperCase()}:</strong>{" "}
                {value || "N/A"}
              </p>
            ))}
          </div>
        )}
      </Dialog>
    </div>
  );
}
