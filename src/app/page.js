import styles from "./page.module.css";
import 'primereact/resources/themes/saga-blue/theme.css';  // Importa el tema que prefieras
import 'primereact/resources/primereact.min.css';  // Importa los estilos de PrimeReact
import 'primeicons/primeicons.css';
import TablaHome from "./%Components/TablaHome/TablaHome";
import Image from 'next/image';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Home</h1>
    </main>
  );
}
