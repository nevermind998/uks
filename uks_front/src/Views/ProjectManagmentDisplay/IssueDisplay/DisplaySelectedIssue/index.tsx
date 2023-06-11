import {  TextField, Card, CardContent, Typography, Divider, List, ListItem, ListItemAvatar, ListItemText, Autocomplete, Button} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import LabelIcon from "@mui/icons-material/Label";
import { useMutation, useQuery } from "react-query";
import { useFormik } from "formik";
import { IssuesDto } from "../../../../Types/issue.types";
import { useState } from "react";
import { ToastOptions } from "../../../../Components/Common/Toast";
import { fetchOptionsForAssigne, fetchOptionsForLabel, fetchOptionsForMilestone, updateIssue } from "../../../../api/projectManagement";

const DisplaySelectedIssue = ({ selectedIssue, setDispayInfo, refetch }: any) => {
    const [open, setOpen] = useState<boolean>(false);
    const [openToast, setOpenToast] = useState(false);
    const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: "", type: "info" });

    const [openModal, setOpenModal] = useState<boolean>(false);

    const assigneesQuery= useQuery(['FETCH_ASSIGNE_USERS'], async() => await fetchOptionsForAssigne(selectedIssue.repository));
    const allMilestonesQuery = useQuery(['FETCH_MILESTONE'], async() => await fetchOptionsForMilestone(selectedIssue.repository));
    const allLabelsQuery = useQuery(['FETCH_LABELS'], async() => await fetchOptionsForLabel(selectedIssue.repository));
    
    function isOptionEqualToValue(option: any, value: any) {
        if (value.value === '') return true;
        return option.value === value.value;
    }

    const { mutate: update } = useMutation(updateIssue, {
        onSuccess: res => {
          setOpenModal(false);
          setToastOptions({ message: "Successfully added collaborator!", type: "success" });
          setOpenToast(true);
          refetch();
   
        },
        onError: () => {
          setToastOptions({ message: "An error happened while adding a new collaborator!", type: "error" });
          setOpenToast(true);
        },
      });
    

    const formik = useFormik({
        initialValues: {
          id:0,
          title:selectedIssue.title,
          created_at:null,
          status:'',
          milestone:null,
          labels:[],
          repository:0,
          author:0,
          assignees:selectedIssue.assignees
        },
        onSubmit: (values) => {
          var arrayAssignees = selectedIssue.assignees.map((a: any) => {return a.id});
          var arrayOfSelectedAssignees =values.assignees.map((a:any) => {return a.value});
          var assignes = [...arrayAssignees, ...arrayOfSelectedAssignees];
          assignes = assignes.filter(item => item !== undefined);

          const arrayLabels = selectedIssue.labels?.map((l: any) => {return l.id});
          const arrayOfSelectedLabels = values.labels?.map((a:any) => {return a.value});
          var labels = [...arrayLabels, ...arrayOfSelectedLabels];
          labels = labels.filter(item => item !== undefined);
         
          const body: IssuesDto = {
            id:selectedIssue.id,
            title:values.title,
            created_at:selectedIssue.created_at,
            status:selectedIssue.status,
            milestone: values.milestone,
            labels: labels,
            repository:selectedIssue.repository,
            author:selectedIssue.author.id,
            assignees: assignes
          };
          update(body);
        }
      });

      
    const handleRemoveUser = (id: number) =>{
        const updatedData = selectedIssue.assignees.filter((u: any) => u.id !== id);
        formik.setFieldValue('assignees', updatedData);
        selectedIssue.assignees = updatedData;
      }

    const handleRemoveLabel= (id: number) =>{
        const updatedData = selectedIssue.labels.filter((l: any) => l.id !== id);
        formik.setFieldValue('labels', updatedData);
        selectedIssue.labels = updatedData;
      }


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
          <Typography variant="body1">
            {selectedIssue.author ? (
              <span>
                Author <i>{selectedIssue.author.username}</i> has opened a issues
              </span>
            ) : (
              ""
            )}
          </Typography>
          <TextField
            variant="outlined"
            name="description"
            size="small"
            multiline
            rows={3}
            value={selectedIssue.description}
            InputProps={{
              readOnly: true,
            }}
            sx={{ width: "100%" }}
          />
        </div>

        {(selectedIssue.assignees.length !== 0 || selectedIssue.issues.length !== 0 || selectedIssue.labels.length !== 0 || selectedIssue.milestone) && (
          <>
            <Card variant="outlined" className="issues__more-info">
              <CardContent>
                <div>
                  {selectedIssue.assignees.length !== 0 && (
                    <>
                    Assignees: <br/>
                      <Autocomplete
                        disablePortal
                        multiple
                        id="assignees"
                        options={assigneesQuery.data?.map((b: any) => ({ value: b.id, label: b.given_name + " " + b.family_name })) || []}
                        isOptionEqualToValue={isOptionEqualToValue}
                        getOptionLabel={(option: any) => option.label}
                        onChange={(event, value) => formik.setFieldValue('assignees', value)}
                        sx={{ width: 300 }}
                        renderInput={(params: any) => <TextField {...params} />}
                      />

                      <List>
                        {selectedIssue.assignees.map((assignee: any) => (
                          <ListItem key={assignee.id}>
                            <ListItemAvatar>
                            <button onClick={() => handleRemoveUser(assignee.id)}>X</button>
                              <AccountCircle fontSize="large" />
                            </ListItemAvatar>
                            <ListItemText primary={`${assignee.given_name} ${assignee.family_name}`}>
                            </ListItemText>
                          </ListItem>
                        ))}
                      </List>
                      
                    </>
                  )}

                  {selectedIssue.labels.length !== 0 && (
                    <>
                    Labels:<br/>
                        <Autocomplete
                            multiple
                            disablePortal
                            id="labels"
                            options={allLabelsQuery.data?.map((label:any) => ({ value: label.id, label: label.name })) || []}
                            value={formik.values.labels}
                            sx={{ width: 300 }}
                            isOptionEqualToValue={isOptionEqualToValue}
                            onChange={(event,value) => formik.setFieldValue("labels", value)}
                            renderInput={(params) => (
                            <TextField
                                {...params}
                            />
                            )}
                        />

                        <List>
                            {selectedIssue.labels.map((label: any) => (
                            <ListItem key={label.id}>
                                <ListItemAvatar>
                                <button onClick={() => handleRemoveLabel(label.id)}>X</button>
                                <LabelIcon fontSize="large" />
                                </ListItemAvatar>
                                <ListItemText primary={label.name}>
                                </ListItemText>
                            </ListItem>
                            ))}
                        </List>
                    </>
                  )}

                  {selectedIssue.milestone && (
                    <>
                    Milestone:<br/>
                    <Autocomplete
                        disablePortal
                        id="milestone"
                        options={allMilestonesQuery.data?.map((m:any) => ({ value: m.id, label: m.title })) || []}
                        onChange={(event,value:any) => formik.setFieldValue("milestone", value.value)}
                        sx={{ width: 300 }}
                        renderInput={(params:any) => <TextField {...params}  />}
                    />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
   
      </div>
      </form>   
    </>
  );
};

export default DisplaySelectedIssue;
