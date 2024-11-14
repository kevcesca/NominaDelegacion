import React, { useEffect, useRef } from 'react';
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
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useMediaQuery } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import KeySharpIcon from '@mui/icons-material/KeySharp';
import CancelPresentationSharpIcon from '@mui/icons-material/CancelPresentationSharp';


export default function NavBar() {
    const isSmallScreen = useMediaQuery('(max-width: 600px)');
    // Inicializa collapsed como true para que esté contraída por defecto
    const [collapsed, setCollapsed] = React.useState(true);
    const sidebarRef = useRef(null);

    useEffect(() => {
        setCollapsed(isSmallScreen); // Contraer la barra en pantallas pequeñas
    }, [isSmallScreen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setCollapsed(true);  // Contraer la barra de navegación si se hace clic fuera
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLinkClick = () => {
        setCollapsed(true);  // Contraer la barra de navegación al hacer clic en un enlace
    };

    return (
        <div className={styles.NavbarContainer} ref={sidebarRef}>
            <Sidebar
                collapsed={collapsed}
                transitionDuration={1000}
                rootStyles={{
                    width: '15vw',
                    fontSize: '.9rem',
                    [`.${sidebarClasses.container}`]: {
                        backgroundColor: '#f4f4f47a',
                        border: '2px solid transparent',
                    },
                    [`.${sidebarClasses.MenuItem}`]: {
                        backgroundColor: 'black',
                        color: 'black'
                    }
                }}
            >
                <Menu
                    menuItemStyles={{
                        subMenuContent: {
                            width: '15vw',  // Ajusta el ancho deseado aquí 
                        },
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

                    {collapsed ? (
                        // Muestra el SubMenu cuando collapsed es true
                        <SubMenu label="Calendario" icon={<CalendarTodayIcon />}>
                            <Link className={styles.tWhite} href="/Calendario" passHref>
                                <MenuItem icon={<EventAvailableIcon />} className={styles.bgblack} onClick={handleLinkClick}>Calendario</MenuItem>
                            </Link>
                        </SubMenu>
                    ) : (
                        // Muestra un solo enlace cuando collapsed es false
                        <Link className={styles.textAlone} href="/Calendario" passHref>
                            <MenuItem icon={<EventAvailableIcon />} onClick={handleLinkClick}>Calendario</MenuItem>
                        </Link>
                    )}

                    {collapsed ? (
                        // Muestra el SubMenu cuando collapsed es true
                        <SubMenu label="Usuarios" icon={<PeopleIcon />}>
                            <Link className={styles.tWhite} href="/GestionUsuarios" passHref>
                                <MenuItem icon={<PeopleIcon />} className={styles.bgblack} onClick={handleLinkClick}>Usuarios</MenuItem>
                            </Link>
                        </SubMenu>
                    ) : (
                        // Muestra un solo enlace cuando collapsed es false1
                        <Link className={styles.textAlone} href="/GestionUsuarios" passHref>
                            <MenuItem icon={<PeopleIcon />} onClick={handleLinkClick}>Usuarios</MenuItem>
                        </Link>
                    )}

                    {collapsed ? (
                        // Muestra el SubMenu cuando collapsed es true
                        <SubMenu label="Roles" icon={<KeySharpIcon />}>
                            <Link className={styles.tWhite} href="/Roles" passHref>
                                <MenuItem icon={<KeySharpIcon />} className={styles.bgblack} onClick={handleLinkClick}>Roles</MenuItem>
                            </Link>
                        </SubMenu>
                    ) : (
                        // Muestra un solo enlace cuando collapsed es false
                        <Link className={styles.textAlone} href="/Roles" passHref>
                            <MenuItem icon={<KeySharpIcon />} onClick={handleLinkClick}>Roles</MenuItem>
                        </Link>
                    )}

                    <SubMenu label="Proceso de Nómina" icon={<SecurityIcon />}>
                        <Link className={styles.tWhite} href="/CrearNomina" passHref>
                            <MenuItem icon={<UploadFileIcon />} className={styles.bgblack} onClick={handleLinkClick}>Cargar Nómina</MenuItem>
                        </Link>
                        <Link className={styles.tWhite} href="/Validacion" passHref>
                            <MenuItem icon={<EditIcon />} className={styles.bgblack} onClick={handleLinkClick}>Cambios en la Nómina</MenuItem>
                        </Link>
                        <Link className={styles.tWhite} href="/CrearNomina/ProcesarDatos" passHref>
                            <MenuItem icon={<AssessmentIcon />} className={styles.bgblack} onClick={handleLinkClick}>Resumen de Nómina</MenuItem>
                        </Link>
                        <Link className={styles.tWhite} href="/AprobarCargaNomina" passHref>
                            <MenuItem icon={<CheckCircleIcon />} className={styles.bgblack} onClick={handleLinkClick}>Aprobar nómina</MenuItem>
                        </Link>
                        <Link className={styles.tWhite} href="/SubirEvidencia" passHref>
                            <MenuItem icon={<UploadFileIcon />} className={styles.bgblack} onClick={handleLinkClick}>Subir Evidencia</MenuItem>
                        </Link>
                    </SubMenu>
                    <SubMenu label="Gestión de Nómina" icon={<SettingsIcon />}>
                        <Link className={styles.tWhite} href="/Configuracion/Conceptos" passHref>
                            <MenuItem icon={<ListIcon />} className={styles.bgblack} onClick={handleLinkClick}>Conceptos</MenuItem>
                        </Link>
                        <Link className={styles.tWhite} href="/Configuracion/Universos" passHref>
                            <MenuItem icon={<ViewListIcon />} className={styles.bgblack} onClick={handleLinkClick}>Universos</MenuItem>
                        </Link>
                        <Link className={styles.tWhite} href="/Configuracion/CLC" passHref>
                            <MenuItem icon={<ViewListIcon />} className={styles.bgblack} onClick={handleLinkClick}>CLC</MenuItem>
                        </Link>
                    </SubMenu>
                    {collapsed ? (
                        // Muestra el SubMenu cuando collapsed es true
                        <SubMenu label="Estados de cuenta" icon={<DescriptionIcon />}>
                            <Link className={styles.tWhite} href="/CargarEstadosCuenta" passHref>
                                <MenuItem icon={<DescriptionIcon />} className={styles.bgblack} onClick={handleLinkClick}>Estados de cuenta</MenuItem>
                            </Link>
                        </SubMenu>
                    ) : (
                        // Muestra un solo enlace cuando collapsed es false1
                        <Link className={styles.textAlone} href="/CargarEstadosCuenta" passHref>
                            <MenuItem icon={<DescriptionIcon />} onClick={handleLinkClick}>Estados de cuenta</MenuItem>
                        </Link>
                    )}
                    {collapsed ? (
                        // Muestra el SubMenu cuando collapsed es true
                        <SubMenu label="Gestión de Cheques" icon={<MoneyIcon />}>
                            <Link className={styles.tWhite} href="/Cheques" passHref>
                                <MenuItem icon={<MoneyIcon />} className={styles.bgblack} onClick={handleLinkClick}>Gestión de Cheques</MenuItem>
                            </Link>
                        </SubMenu>
                    ) : (
                        // Muestra un solo enlace cuando collapsed es false1
                        <Link className={styles.textAlone} href="/Cheques" passHref>
                            <MenuItem icon={<MoneyIcon />} onClick={handleLinkClick}>Gestión de Cheques</MenuItem>
                        </Link>
                    )}
                    {collapsed ? (
                        // Muestra el SubMenu cuando collapsed es true
                        <SubMenu label="Cancelacion de Cheques" icon={<CancelPresentationSharpIcon />}>
                            <Link className={styles.tWhite} href="/Cheques/Cancelacion" passHref>
                                <MenuItem icon={<CancelPresentationSharpIcon />} className={styles.bgblack} onClick={handleLinkClick}>Cancelacion de Cheques</MenuItem>
                            </Link>
                        </SubMenu>
                    ) : (
                        // Muestra un solo enlace cuando collapsed es false1
                        <Link className={styles.textAlone} href="/Cheques/Cancelacion" passHref>
                            <MenuItem icon={<CancelPresentationSharpIcon />} onClick={handleLinkClick}>Cancelacion de Cheques</MenuItem>
                        </Link>
                    )}
                    {collapsed ? (
                        // Muestra el SubMenu cuando collapsed es true
                        <SubMenu label="Reportes" icon={<AssessmentIcon />}>
                            <Link className={styles.tWhite} href="/ListaReportes" passHref>
                                <MenuItem icon={<AssessmentIcon />} className={styles.bgblack} onClick={handleLinkClick}>Reportes</MenuItem>
                            </Link>
                        </SubMenu>
                    ) : (
                        // Muestra un solo enlace cuando collapsed es false1
                        <Link className={styles.textAlone} href="/ListaReportes" passHref>
                            <MenuItem icon={<AssessmentIcon />} onClick={handleLinkClick}>Reportes</MenuItem>
                        </Link>
                    )}
                </Menu>
            </Sidebar>
        </div>
    );
}
