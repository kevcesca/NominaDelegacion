import React from 'react';
import ConfigurableTable from '../%Components/ConfigurableTable/ConfigurableTable';
import styles from './page.module.css'

const Page = () => {
    return (
        <main className={styles.main}>
            <div className={styles.tableContainer}>
                <ConfigurableTable />
            </div>
        </main>
    );
};

export default Page;
