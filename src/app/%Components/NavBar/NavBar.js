import React from 'react';
import Link from 'next/link';
import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses } from 'react-pro-sidebar';
import styles from './NavBar.module.css';

import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import StorageIcon from '@mui/icons-material/Storage';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import AppsIcon from '@mui/icons-material/Apps';

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
            <MenuItem icon={<StorageIcon />} className={styles.bgblack}> Recursos</MenuItem>
            <MenuItem icon={<NetworkCheckIcon />} className={styles.bgblack}> Red</MenuItem>
            <MenuItem icon={<AppsIcon />} className={styles.bgblack}> Aplicaciones</MenuItem>
          </SubMenu>
          <SubMenu label="Horarios" icon={<AccessTimeIcon />}>
            <MenuItem icon={<DescriptionIcon />} className={styles.bgblack}> Documentation</MenuItem>
            <MenuItem icon={<CalendarTodayIcon />} className={styles.bgblack}> Calendar</MenuItem>
            <MenuItem icon={<StorefrontIcon />} className={styles.bgblack}> E-commerce</MenuItem>
          </SubMenu>
          <SubMenu label="Permisos" icon={<PlaceIcon />}>
            <Link className={styles.tWhite} href="/CargarDatos" passHref>
              <MenuItem icon={<DescriptionIcon />} className={styles.bgblack}> Ver usuarios</MenuItem>
            </Link>
              <MenuItem icon={<CalendarTodayIcon />} className={styles.bgblack}> Calendar</MenuItem>
              <MenuItem icon={<StorefrontIcon />} className={styles.bgblack}> E-commerce</MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </div>
  );
}
