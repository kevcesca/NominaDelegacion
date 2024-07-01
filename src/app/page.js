import styles from "./page.module.css";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import CustomCarousel from './%Components/Carousel/Carousel'

export default function Home() {
    return (
        <main className={styles.main}>
            <h1>Home</h1>
            <CustomCarousel />
        </main>
    );
}
