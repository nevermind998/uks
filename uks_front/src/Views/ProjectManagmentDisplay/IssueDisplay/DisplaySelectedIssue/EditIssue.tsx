import { TextField, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Button, Select, MenuItem, Autocomplete } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { IssuesDto } from "../../../../Types/issue.types";
import { useMutation } from "react-query";
import { updateIssue } from "../../../../api/projectManagement";
import { useFormik } from "formik";
import { useState } from "react";
import Toast, { ToastOptions } from "../../../../Components/Common/Toast";

const EditIssue = ({ setDispayInfo, selectedIssue, setEditMode, refetch, assigneesQuery, allMilestonesQuery, allLabelsQuery }) => {
    const [open, setOpen] = useState<boolean>(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: "", type: "info" });
const [selectedMilestone, setSelectedMilestone] = useState<any>(selectedIssue.milestone.title);

    const { mutate: update } = useMutation(updateIssue, {
    onSuccess: res => {
        refetch();
        setOpen(true);
        setToastOptions({"message": 'Sve kul', type: 'success'})

      setTimeout(() => {
        setDispayInfo(false);
      }, 300);
    },
    onError: () => {
        setOpen(true);
        setToastOptions({"message": 'Ne valja nest', type: 'error'})
    },
  });

  const possibleAssignees = assigneesQuery?.filter((u: any) => {
    const isAssignee = selectedIssue.assignees.some((assignee: any) => assignee.id === u.id);
    return !isAssignee;
  });

  const possibleLabels = allLabelsQuery?.filter((u: any) => {
    const isLabel = selectedIssue.labels.some((label: any) => label.id === u.id);
    return !isLabel;
  });

  const formik = useFormik({
    initialValues: {
      id: selectedIssue.id,
      title: selectedIssue.title,
      created_at: selectedIssue.created_at,
      status: selectedIssue.status,
      milestone: selectedIssue.milestone.id,
      labels: selectedIssue.labels,
      repository: selectedIssue.repository,
      author: selectedIssue.author.id,
      assignees: selectedIssue.assignees,
    },
    onSubmit: values => {
      var arrayAssignees = selectedIssue.assignees.map((a: any) => {
        return a.id;
      });
      var arrayOfSelectedAssignees = values.assignees.map((a: any) => {
        return a.value;
      });
      var assignes = [...arrayAssignees, ...arrayOfSelectedAssignees];
      assignes = assignes.filter(item => item !== undefined);

      const arrayLabels = selectedIssue.labels?.map((l: any) => {
        return l.id;
      });
      const arrayOfSelectedLabels = values.labels?.map((a: any) => {
        return a.value;
      });
      var labels = [...arrayLabels, ...arrayOfSelectedLabels];
      labels = labels.filter(item => item !== undefined);

      const body: IssuesDto = {
        id: selectedIssue.id,
        title: values.title,
        created_at: selectedIssue.created_at,
        status: selectedIssue.status,
        milestone: values.milestone,
        labels: labels,
        repository: selectedIssue.repository,
        author: selectedIssue.author.id,
        assignees: assignes,
      };
      update(body);
    },
  });

  const handleRemoveUser = (id: number) => {
    const updatedData = selectedIssue.assignees.filter((u: any) => u.id !== id);
    formik.setFieldValue("assignees", updatedData);
    selectedIssue.assignees = updatedData;
  };

  const handleRemoveLabel = (id: number) => {
    const updatedData = selectedIssue.labels.filter((l: any) => l.id !== id);
    formik.setFieldValue("labels", updatedData);
    selectedIssue.labels = updatedData;
  };

  function isOptionEqualToValue(option: any, value: any) {
    if (value.value === '') return true;
    return option.value === value.value;
  }

  return (
    <>
    <Toast open={open} setOpen={setOpen} toastOptions={toastOptions} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setEditMode(false)} className="create-repository__back-button" style={{ color: "black" }}>
          &#60; Back
        </button>
      </div>

      <form onSubmit={formik.handleSubmit} className="edit-issue__form">
        <TextField
          id="title"
          label="Title"
          variant="outlined"
          value={formik.values.title}
          onChange={formik.handleChange}
          name="title"
          error={formik.touched.title && Boolean(formik.errors.title)}
          required
          className="manage-access__general--form-field"
          size="small"
        />

        <div className="pr__single-pr-display">
          {(selectedIssue?.assignees || selectedIssue?.issues || selectedIssue?.labels || selectedIssue?.milestone) && (
            <>
              <Card variant="outlined" className="pr__more-info">
                <CardContent>
                  <div>
                    <div className="edit-issue__assignees">
                      Assignees:
                      {selectedIssue.assignees.length > 0 && (
                        <List>
                          {selectedIssue.assignees.map((assignee: any) => (
                            <ListItem key={assignee.id}>
                              <ListItemAvatar>
                                <DeleteIcon fontSize="small" onClick={() => handleRemoveUser(assignee.id)} />
                              </ListItemAvatar>
                              <ListItemText primary={`${assignee.given_name} ${assignee.family_name}`}></ListItemText>
                            </ListItem>
                          ))}
                        </List>
                      )}
                      <Autocomplete
            className="add-update-form__form--field"
            size="small"
            disablePortal
            multiple
            id="assignees"
            options={possibleAssignees?.map((b: any) => ({ value: b.id, label: b.given_name + ' ' + b.family_name })) || []}
            isOptionEqualToValue={isOptionEqualToValue}
            onChange={(event, value: any) => formik.setFieldValue('assignees', value)}
            renderInput={(params: any) => <TextField {...params} label="Select assignees" />}
          />
                    </div>

                    <div className="edit-issue__assignees">
                      Labels:
                      {selectedIssue.labels?.length > 0 && (
                        <List>
                          {selectedIssue.labels.map((label: any) => (
                            <ListItem key={label.id}>
                              <ListItemAvatar>
                                <DeleteIcon fontSize="small" onClick={() => handleRemoveLabel(label.id)} />
                              </ListItemAvatar>
                              <ListItemText primary={label.name}></ListItemText>
                            </ListItem>
                          ))}
                        </List>
                      )}
                      <Autocomplete
            className="add-update-form__form--field"
            size="small"
            disablePortal
            multiple
            id="labels"
            options={possibleLabels?.map((b: any) => ({ value: b.id, label: b.name })) || []}
            isOptionEqualToValue={isOptionEqualToValue}
            onChange={(event, value: any) => formik.setFieldValue('labels', value)}
            renderInput={(params: any) => <TextField {...params} label="Select labels" />}
          />
                    </div>

                      <div className="edit-issue__assignees">
                        Milestone:
                    {selectedIssue.milestone && (
                        <ul>
                          <li>
                            {selectedMilestone}
                          </li>
                        </ul>
                    )}
                    <Autocomplete
                    className="add-update-form__form--field"
                    size="small"
                    disablePortal
                    id="labels"
                    options={allMilestonesQuery?.map((b: any) => {return {value: b.id, label: b.title }})}
                    isOptionEqualToValue={isOptionEqualToValue}
                    onChange={(event, value: any) => { formik.setFieldValue('milestone', value.value); setSelectedMilestone(value.label)}}
                    renderInput={(params: any) => <TextField {...params} label="Select milestone" />}
                  />
                      </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        <div className="manage-access__general--buttons">
          <Button type="submit" variant="contained">
            Save Changes
          </Button>
        </div>
      </form>
    </>
  );
};

export default EditIssue;
