import React from 'react';
import { TextField } from '@material-ui/core';

export default function Input(props) {
  const { name, label, value, error = null, onChange, type, ...other } = props;
  return (
    <TextField
      fullWidth
      variant="outlined"
      label={label}
      type={type}
      name={name}
      value={value}
      {...other}
      onChange={onChange}
      {...(error && { error: true, helperText: error })}
    />
  );
}
