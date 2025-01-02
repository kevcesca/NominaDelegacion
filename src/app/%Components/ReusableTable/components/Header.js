import React from "react";
import PropTypes from "prop-types";
import { Button, TextField } from "@mui/material";
import styles from "../ReusableTable.module.css";

const Header = ({ insertable, onInsert, searchQuery, setSearchQuery }) => (
    <div className={styles.header}>
        {insertable && (
            <Button color="success" variant="contained" onClick={onInsert}>
                Crear
            </Button>
        )}
        <TextField
            placeholder="Buscar..."
            variant="outlined"
            size="small"
            className={styles.searchBar}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
    </div>
);

Header.propTypes = {
    insertable: PropTypes.bool.isRequired,
    onInsert: PropTypes.func,
    searchQuery: PropTypes.string.isRequired,
    setSearchQuery: PropTypes.func.isRequired,
};

export default Header;
