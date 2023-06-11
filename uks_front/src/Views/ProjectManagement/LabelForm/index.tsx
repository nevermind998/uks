import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import Toast, { ToastOptions } from "../../../Components/Common/Toast";
import { useParams } from "react-router-dom";
import { createLabel } from "../../../api/projectManagement";
import { useMutation } from "react-query";
import { LABEL_SCHEMA } from "./labelSchema";
import { ChromePicker } from "react-color";
import { LabelDto } from "../../../Types/label.types";

const Label = ({ setCreateLabel }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: "", type: "info" });
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const { id } = useParams();
  const repositoryId = id ? parseInt(id, 10) : 0;

  const { mutate, isLoading } = useMutation(createLabel, {
    onSuccess: res => {
      setToastOptions({ message: "Label successfully created", type: "success" });
      setOpen(true);
      setCreateLabel(false);
    },
    onError: () => {
      setToastOptions({ message: "Error creating label", type: "error" });
      setOpen(true);
    },
  });

  const handleColorChange = (color: any) => {
    formik.setFieldValue("color", color.hex);
    setSelectedColor(color.hex);
  };

  const formik = useFormik({
    initialValues: {
      id: 0,
      name: "",
      description: "",
      color: "",
      repository: 0,
    },
    validationSchema: LABEL_SCHEMA,
    onSubmit: (values: any) => {
      const body: LabelDto = {
        id: 0,
        name: values.name,
        description: values.description,
        color: values.color,
        repository: repositoryId,
      };

      mutate(body);
    },
  });

  return (
    <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
      <Toast open={open} setOpen={setOpen} toastOptions={toastOptions} />
      <div style={{ textAlign: "center", display: "flex", width: "100%", flexDirection: "column", justifyContent: "center" }}>
        <h3>Create a new label</h3>
        <form onSubmit={formik.handleSubmit} className="label-form__form">
          <div className="label-form__group">
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              value={formik.values.name}
              onChange={formik.handleChange}
              name="name"
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.errors.name && formik.touched.name ? "Error" : null}
              required
              className="label-form__form--field"
              size="small"
            />
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              value={formik.values.description}
              onChange={formik.handleChange}
              name="description"
              required
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.errors.description && formik.touched.description ? "Error" : null}
              className="label-form__form--field"
              size="small"
            />
            <ChromePicker color={selectedColor} onChange={handleColorChange} />
          </div>
          <Button type="submit" className="label-form__button" variant="contained">
            Create label
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Label;
