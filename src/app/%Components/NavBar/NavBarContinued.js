import React from 'react';
import Link from 'next/link';
import { SubMenu, MenuItem } from 'react-pro-sidebar';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EditIcon from '@mui/icons-material/Edit';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import MoneyIcon from '@mui/icons-material/Money';
import ViewListIcon from '@mui/icons-material/ViewList';
import ListIcon from '@mui/icons-material/List';
import styles from './NavBar.module.css';

export default function NavBarContinued({ handleLinkClick }) {
    return (
        <>
            <SubMenu label="Proceso de Nómina" icon={<UploadFileIcon />}>
                <Link href="/CrearNomina" passHref>
                    <MenuItem icon={<UploadFileIcon />} onClick={handleLinkClick}>
                        Cargar Nómina
                    </MenuItem>
                </Link>
                <Link href="/Validacion" passHref>
                    <MenuItem icon={<EditIcon />} onClick={handleLinkClick}>
                        Cambios de la Nómina
                    </MenuItem>
                </Link>
                <Link href="/CrearNomina/ProcesarDatos" passHref>
                    <MenuItem icon={<AssessmentIcon />} onClick={handleLinkClick}>
                        Resumen de la Nómina
                    </MenuItem>
                </Link>
                <Link href="/AprobarCargaNomina" passHref>
                    <MenuItem icon={<CheckCircleIcon />} onClick={handleLinkClick}>
                        Aprobar Nómina
                    </MenuItem>
                </Link>
            </SubMenu>

            <SubMenu label="Gestión de Nómina" icon={<DescriptionIcon />}>
                <Link href="/Configuracion/Conceptos" passHref>
                    <MenuItem icon={<ListIcon />} onClick={handleLinkClick}>
                        Conceptos
                    </MenuItem>
                </Link>
                <Link href="/Configuracion/Universos" passHref>
                    <MenuItem icon={<ViewListIcon />} onClick={handleLinkClick}>
                        Universos
                    </MenuItem>
                </Link>
            </SubMenu>

            <SubMenu label="Gestión de Cheques" icon={<MoneyIcon />}>
                <Link href="/Cheques" passHref>
                    <MenuItem icon={<MoneyIcon />} onClick={handleLinkClick}>
                        Gestión de Cheques
                    </MenuItem>
                </Link>
                <Link href="/Cheques/Cancelacion" passHref>
                    <MenuItem icon={<MoneyIcon />} onClick={handleLinkClick}>
                        Cancelación de Cheques
                    </MenuItem>
                </Link>
            </SubMenu>

            <SubMenu label="Reportes" icon={<AssessmentIcon />}>
                <Link href="/ListaReportes" passHref>
                    <MenuItem icon={<AssessmentIcon />} onClick={handleLinkClick}>
                        Reportes
                    </MenuItem>
                </Link>
            </SubMenu>
        </>
    );
}
