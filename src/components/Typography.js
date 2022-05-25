import React from 'react'
import { styled } from '@mui/material/styles';
import { Typography as MUITypography } from '@mui/material/';

const StyledMUITypography = styled(MUITypography)`
  color: #6667AB;
`

const Typography = ({ children, ...otherProps }) => {
  return (
    <StyledMUITypography {...otherProps}>{children}</StyledMUITypography>
  )
}

export default Typography