import React from 'react'
import { Field } from "formik";
import { TextField as MUITextField } from '@mui/material/';



const TextField = ({ type, name, label }) => {
  return (
    <Field
      validateOnBlur
      validateOnChange
      name={name}
    >
      {({ field, form, meta }) => (
        <MUITextField type={type} name={name} label={label} sx={{backgroundColor: "#EAEFFF"}} {...field}/>
      )}
    </Field>
  )
}

export default TextField