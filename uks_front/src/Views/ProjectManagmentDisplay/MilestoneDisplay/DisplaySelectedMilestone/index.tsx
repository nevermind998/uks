import {  TextField, Divider, Button} from "@mui/material";
import { useMutation,  } from "react-query";
import { useFormik } from "formik";
import { useState } from "react";
import { ToastOptions } from "../../../../Components/Common/Toast";
import { updateMilestone } from "../../../../api/projectManagement";
import { MilestoneDto } from "../../../../Types/milestone.types";
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


const DisplaySelectedMilestone = ({ selectedMilestone, setDispayInfo, refetch }: any) => {
    const [openToast, setOpenToast] = useState(false);
    const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: "", type: "info" });
    const [selectedDate, setSelectedDate] = useState(null);
    var selectedDateField = selectedMilestone.due_date;

    const { mutate: update } = useMutation(updateMilestone, {
        onSuccess: res => {
          setToastOptions({ message: "Saved!", type: "error" });
          setOpenToast(true);
          refetch();
        },
        onError: () => {
          setToastOptions({ message: "An error happened while updating!", type: "error" });
          setOpenToast(true);
        },
      });
    

    const formik = useFormik({
        initialValues: {
            id: 0,
            title: selectedMilestone.title,
            due_date: selectedMilestone.due_date,
            description: selectedMilestone.description,
            status: selectedMilestone.status,
            repository: selectedMilestone.repository
        },
        onSubmit: (values) => {
          const body: MilestoneDto = {
            id:selectedMilestone.id,
            title:values.title,
            description: values.description,
            due_date: values.due_date,
            status:selectedMilestone.status,
            repository:selectedMilestone.repository,
          };

          update(body);
        }
      });

      
  const handleDateChange = (date:any) => {
    selectedDateField = date;
    formik.setFieldValue('due_date', date);
  };


  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setDispayInfo(false)} className="create-repository__back-button" style={{ color: "black" }}>
          &#60; Back
        </button>
        </div>
        <form onSubmit={formik.handleSubmit} className="manage-access__general--form">

        <TextField
            id="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            name="title"
            error={formik.touched.title && Boolean(formik.errors.title)}
            required
            className="issues__title"
            size="small"
        />

      <Button type="submit"  className="issues__button">Save</Button>
      <Divider light />
      <br />

      <div className="issues__single-pr-display">
        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "10px" }}>

        <TextField
            id="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            name="description"
            error={formik.touched.description && Boolean(formik.errors.description)}
            sx={{ width: "100%" }}
            size="small"
        />

        <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DatePicker 
                label="Due date (optional)"
                value={selectedDate }
                onChange={handleDateChange}
                className="add-update-form__form--field"
            />
        </LocalizationProvider>
        </div>
      </div>
      </form>   
    </>
  );
};

export default DisplaySelectedMilestone;
