import { TextField, Card, CardContent, Typography, Divider, Button, Chip } from "@mui/material";
import { useMutation } from "react-query";
import { useFormik } from "formik";
import { useState } from "react";
import { ToastOptions } from "../../../../Components/Common/Toast";
import { updateLabel } from "../../../../api/projectManagement";
import { LabelDto } from "../../../../Types/label.types";
import { ChromePicker } from "react-color";

const DisplaySelectedLabel = ({ selectedLabel, setDispayInfo, refetch }: any) => {
  const [openToast, setOpenToast] = useState(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: "", type: "info" });
  const [selectedColor, setSelectedColor] = useState(selectedLabel.color);

  const { mutate: update } = useMutation(updateLabel, {
    onSuccess: res => {
      refetch();
      setDispayInfo(false);
    },
    onError: () => {
      setToastOptions({ message: "An error happened while updating!", type: "error" });
      setOpenToast(true);
    },
  });

  const formik = useFormik({
    initialValues: {
      id: selectedLabel.id,
      name: selectedLabel.name,
      description: selectedLabel.description,
      color: selectedLabel.color,
      repository: selectedLabel.repository,
    },
    onSubmit: values => {
      const body: LabelDto = {
        id: selectedLabel.id,
        name: values.name,
        description: values.description,
        color: values.color,
        repository: selectedLabel.repository,
      };
      update(body);
    },
  });

  const handleColorChange = (color: any) => {
    formik.setFieldValue("color", color.hex);
    setSelectedColor(color.hex);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setDispayInfo(false)} className="create-repository__back-button" style={{ color: "black" }}>
          &#60; Back
        </button>
      </div>
      <div className="label__title">
        <Chip label={selectedLabel.name} style={{ backgroundColor: selectedLabel.color }} />
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div style={{ display: "flex", alignItems: 'center', flexDirection: "column", width: "100%", gap: "10px" }}>
            <TextField
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              name="name"
              error={formik.touched.name && Boolean(formik.errors.name)}
              required
              sx={{ width: "80%" }}
              size="small"
            />
            <TextField
              className="manage-access__general--form-field"
              variant="outlined"
              name="description"
              size="small"
              multiline
              rows={3}
              value={formik.values.description}
              InputProps={{
                readOnly: true,
              }}
              sx={{ width: "80%" }}
            />
            <Button type="submit" variant="contained">Save</Button>
          </div>
          {selectedLabel.color && <ChromePicker color={selectedColor} onChange={handleColorChange} />}
        </div>
      </form>
    </>
  );
};

export default DisplaySelectedLabel;
