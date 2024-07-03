// src/app/%Components/NavBar/NavBar.js
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
import MemoryIcon from '@mui/icons-material/Memory';
import ComputerIcon from '@mui/icons-material/Computer';
import CloudIcon from '@mui/icons-material/Cloud';

export default function NavBar() {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className={styles.NavbarContainer} style={{ display: 'flex', height: '100%', minHeight: '400px' }}>
      <Sidebar
        collapsed={collapsed}
        transitionDuration={1000}
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: '#24242c',
            color: 'white'
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
                backgroundColor: '#104674',
                color: 'white',
              },
            }),
          }}
        >
          <button className={styles.botonNavbar} onClick={() => setCollapsed(!collapsed)}>
            <MenuIcon fontSize="large" className={styles.hamburgerIcon} />
          </button>
          <SubMenu label="Configuración" icon={<SettingsIcon />} >
            <MenuItem icon={<MemoryIcon />} className={styles.bgblack}> Recursos</MenuItem>
            <MenuItem icon={<CloudIcon />} className={styles.bgblack}> Red</MenuItem>
            <MenuItem icon={<ComputerIcon />} className={styles.bgblack}> Aplicaciones</MenuItem>
          </SubMenu>
          <SubMenu label="Nomina" icon={<SecurityIcon />}>
            <Link className={styles.tWhite} href="/CrearNomina" passHref>
              <MenuItem icon={<PeopleIcon />} className={styles.bgblack}> Crear Nomina</MenuItem>
            </Link>
            <Link className={styles.tWhite} href="/Validacion" passHref>
              <MenuItem icon={<EventAvailableIcon />} className={styles.bgblack}> Validacion de nomina</MenuItem>
            </Link>
          </SubMenu>
          <SubMenu label="Reportes" icon={<AssessmentIcon />}>
            <Link className={styles.tWhite} href="/Reportes" passHref>
              <MenuItem icon={<EventAvailableIcon />} className={styles.bgblack}>Generar reporte</MenuItem>
            </Link>
          </SubMenu>
          <SubMenu label="Cheques" icon={<AssessmentIcon />}>
            <Link className={styles.tWhite} href="/GenerarCheque" passHref>
              <MenuItem icon={<EventAvailableIcon />} className={styles.bgblack}>Generar cheque</MenuItem>
            </Link>
          </SubMenu>
        </Menu>
      </Sidebar>
    </div>
  );
}
