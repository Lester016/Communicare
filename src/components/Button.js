import React from 'react'
import { Button as MUIBUtton } from '@mui/material/';

const Button = ({ children, ...otherProps }) => {
  return (
    <MUIBUtton variant="contained" size="large" {...otherProps}>{children}</MUIBUtton>
  )
}

export default Button