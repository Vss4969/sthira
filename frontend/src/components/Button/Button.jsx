import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

const Button = ({ children, onClick, disabled }) => (
    <button
        type="button"
        className={styles.button}
        onClick={onClick}
        disabled={disabled}
    >
        {children}
    </button>
    );

Button.propTypes = {
    children: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
};

Button.defaultProps = {
    disabled: false,
};

export default Button;
