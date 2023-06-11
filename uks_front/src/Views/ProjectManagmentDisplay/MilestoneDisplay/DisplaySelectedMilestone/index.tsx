import { TextField, Divider, Button, Chip } from "@mui/material";
import { useMutation } from "react-query";
import { useFormik } from "formik";
import { useState } from "react";
import Toast, { ToastOptions } from "../../../../Components/Common/Toast";
import { updateMilestone } from "../../../../api/projectManagement";
import { MilestoneDto } from "../../../../Types/milestone.types";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const DisplaySelectedMilestone = ({ selectedMilestone, setDispayInfo, refetch }: any) => {
  const [openToast, setOpenToast] = useState(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: "", type: "info" });
  const [selectedDate, setSelectedDate] = useState(dayjs(selectedMilestone.due_date));

  const { mutate: update } = useMutation(updateMilestone, {
    onSuccess: res => {
      setToastOptions({ message: "Saved!", type: "error" });
      setOpenToast(true);
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
      id: selectedMilestone.id,
      title: selectedMilestone.title,
      due_date: selectedMilestone.due_date,
      description: selectedMilestone.description,
      status: selectedMilestone.status,
      repository: selectedMilestone.repository,
    },
    onSubmit: values => {
      const body: MilestoneDto = {
        id: selectedMilestone.id,
        title: values.title,
        description: values.description,
        due_date: values.due_date,
        status: selectedMilestone.status,
        repository: selectedMilestone.repository,
      };

      update(body);
    },
  });

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    formik.setFieldValue("due_date", date);
  };

  return (
    <>
      <Toast open={openToast} setOpen={setOpenToast} toastOptions={toastOptions} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setDispayInfo(false)} className="create-repository__back-button" style={{ color: "black" }}>
          &#60; Back
        </button>
      </div>
      <h3 style={{ textAlign: "center" }}>{selectedMilestone.title}</h3>
      <form onSubmit={formik.handleSubmit} style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', justifyContent: 'center'}}>
        <TextField
          id="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          name="title"
          error={formik.touched.title && Boolean(formik.errors.title)}
          required
          sx={{width: '80%'}}
          size="small"
        />
        <TextField
          id="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          name="description"
          error={formik.touched.description && Boolean(formik.errors.description)}
          sx={{width: '80%'}}
          size="small"
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Due date (optional)" value={selectedDate} onChange={handleDateChange} sx={{width: '80%'}}/>
        </LocalizationProvider>
        <Button type="submit" variant="contained" style={{width: '150px'}}>
          Save
        </Button>
      </form>
    </>
  );
};

export default DisplaySelectedMilestone;
