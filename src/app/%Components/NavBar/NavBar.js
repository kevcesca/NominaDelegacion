import React from 'react';
import Link from 'next/link';
import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses } from 'react-pro-sidebar';
import styles from './NavBar.module.css';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CloudIcon from '@mui/icons-material/Cloud';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoneyIcon from '@mui/icons-material/Money';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import ListIcon from '@mui/icons-material/List';
import ViewListIcon from '@mui/icons-material/ViewList';

export default function NavBar() {
    const [collapsed, setCollapsed] = React.useState(false);

    return (
        <div className={styles.NavbarContainer}>
            <Sidebar
                collapsed={collapsed}
                transitionDuration={1000}
                rootStyles={{
                    [`.${sidebarClasses.container}`]: {
                        backgroundColor: 'transparent',
                        border: '2px solid transparent', // Esto se puede ajustar según sea necesario
                    },
                    [`.${sidebarClasses.MenuItem}`]: {
                        backgroundColor: 'black',
                        color: 'black'
                    },
                }}
            >
                <Menu
                    menuItemStyles={{
                        button: ({ level, active, disabled }) => ({
                            '&:hover': {
                                backgroundColor: '#9f2241',
                                color: 'white',
                            },
                        }),
                    }}
                >
                    <button className={styles.botonNavbar} onClick={() => setCollapsed(!collapsed)}>
                        <MenuIcon fontSize="large" className={styles.hamburgerIcon} />
                    </button>
                    <SubMenu label="Calendario de nómina" icon={<CalendarTodayIcon />} >
                        <Link className={styles.tWhite} href="/Calendario" passHref>
                            <MenuItem icon={<EventAvailableIcon />} className={styles.bgblack}>Editar</MenuItem>
                        </Link>
                        <Link className={styles.tWhite} href="/Calendario/Exportar" passHref>
                            <MenuItem icon={<CloudIcon />} className={styles.bgblack}>Exportar</MenuItem>
                        </Link>
                    </SubMenu> 
                    <SubMenu label="Proceso de Nómina" icon={<SecurityIcon />}>
                        <Link className={styles.tWhite} href="/CrearNomina" passHref>
                            <MenuItem icon={<UploadFileIcon />} className={styles.bgblack}>Cargar Nómina</MenuItem>
                        </Link>
                        <Link className={styles.tWhite} href="/AprobarCargaNomina" passHref>
                            <MenuItem icon={<CheckCircleIcon />} className={styles.bgblack}>Aprobar nómina</MenuItem>
                        </Link>
                        <Link className={styles.tWhite} href="/CrearNomina/ProcesarDatos" passHref>
                            <MenuItem icon={<AssessmentIcon />} className={styles.bgblack}>Resumen de Nómina</MenuItem>
                        </Link>
                        <Link className={styles.tWhite} href="/Validacion" passHref>
                            <MenuItem icon={<EditIcon />} className={styles.bgblack}>Cambios en la Nómina</MenuItem>
                        </Link>
                        <Link className={styles.tWhite} href="/SubirEvidencia" passHref>
                            <MenuItem icon={<UploadFileIcon />} className={styles.bgblack}>Subir Evidencia</MenuItem>
                        </Link>
                    </SubMenu>
                    <SubMenu label="Gestión de Nómina" icon={<SettingsIcon />} >
                        <Link className={styles.tWhite} href="/Configuracion/Conceptos" passHref>
                            <MenuItem icon={<ListIcon />} className={styles.bgblack}>Conceptos</MenuItem>
                        </Link>
                        <Link className={styles.tWhite} href="/Configuracion/Universos" passHref>
                            <MenuItem icon={<ViewListIcon />} className={styles.bgblack}>Universos</MenuItem>
                        </Link>
                    </SubMenu>
                    <SubMenu label="Reportes" icon={<AssessmentIcon />}>
                        <Link className={styles.tWhite} href="/ListaReportes" passHref>
                            <MenuItem icon={<DescriptionIcon />} className={styles.bgblack}>Lista Reportes</MenuItem>
                        </Link>
                    </SubMenu>
                    <SubMenu label="Cheques" icon={<MoneyIcon />}>
                        <Link className={styles.tWhite} href="/ListaCheques" passHref>
                            <MenuItem icon={<AttachFileIcon />} className={styles.bgblack}>Generar Cheque</MenuItem>
                        </Link>
                    </SubMenu>
                    <Link className={styles.tWhite} href="/Empleados" passHref>
                        <SubMenu label="Empleados" icon={<PeopleIcon />} />
                    </Link>
                </Menu>
            </Sidebar>
        </div>
    );
}
