"use client"; // Asegura que el código se ejecute solo en el cliente
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";

export default function MyComponent() {
  const router = useRouter();

  // Función para navegar hacia atrás
  const goBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      {/* Encabezado del contenedor con imagen y botón de regreso */}
      <div className={styles.title}>
        <h1>Cambio para el tipo de pago</h1>
      </div>

      {/* Contenido del contenedor */}
      <div className={styles.content}>
        <h3>Seleccione el tipo de cambio</h3>

        {/* Enlaces a las rutas de cambio de método de pago */}
        <Link href="/Cheques/CambioPago/Cheque-Trans" className={styles.optionButton}>
          Cheque a Transferencia
        </Link>
        <Link href="/Cheques/CambioPago/Trans-Cheque" className={styles.optionButton}>
          Transferencia a Cheque
        </Link>
      </div>
    </div>
  );
}

