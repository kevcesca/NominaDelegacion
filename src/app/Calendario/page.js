import React from 'react';
import YearSelector from '../%Components/ConfigurableTable/YearSelector';
import styles from './page.module.css';

const Page = () => {
    return (
        <main className={styles.main}>
            <div className={styles.tableContainer}>
                <YearSelector />
            </div>
        </main>
    );
};

export default Page;