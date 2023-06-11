import { Card, CardContent, Divider, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import LabelIcon from "@mui/icons-material/Label";
import EditIcon from "@mui/icons-material/Edit";
import { useQuery } from "react-query";
import { useState } from "react";
import { fetchOptionsForAssigne, fetchOptionsForLabel, fetchOptionsForMilestone } from "../../../../api/projectManagement";
import EditIssue from "./EditIssue";

const DisplaySelectedIssue = ({ selectedIssue, setDispayInfo, refetch }: any) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  
    const {data: assigneesQuery}= useQuery(['FETCH_ASSIGNE_USERS'], async() => await fetchOptionsForAssigne(selectedIssue.repository));
    const {data: allMilestonesQuery} = useQuery(['FETCH_MILESTONE'], async() => await fetchOptionsForMilestone(selectedIssue.repository));
    const {data: allLabelsQuery} = useQuery(['FETCH_LABELS'], async() => await fetchOptionsForLabel(selectedIssue.repository));

  return (
    <>
      {!editMode ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setDispayInfo(false)} className="create-repository__back-button" style={{ color: "black" }}>
              &#60; Back
            </button>
          </div>
          <div style={{ textAlign: "center", display: "flex", width: "100%", justifyContent: "center", alignItems: "center", gap: "20px" }}>
            <h3>{selectedIssue.title}</h3>
            <EditIcon onClick={() => setEditMode(true)} />
          </div>
          <Divider light />
          <br />

          <div className="pr__single-pr-display">
            {(selectedIssue?.assignees || selectedIssue?.labels || selectedIssue?.milestone) && (
              <>
                <Card variant="outlined" className="pr__more-info">
                  <CardContent>
                    <div>
                      {selectedIssue.assignees.length > 0 && (
                        <>
                          Assignees:
                          <List>
                            {selectedIssue.assignees.map((assignee: any) => (
                              <ListItem key={assignee.id}>
                                <ListItemAvatar>
                                  <AccountCircle fontSize="small" />
                                </ListItemAvatar>
                                <ListItemText primary={`${assignee.given_name} ${assignee.family_name}`}></ListItemText>
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}

                      {selectedIssue.labels?.length > 0 && (
                        <>
                          Labels:
                          <List>
                            {selectedIssue.labels.map((label: any) => (
                              <ListItem key={label.id}>
                                <ListItemAvatar>
                                  <LabelIcon fontSize="small" />
                                </ListItemAvatar>
                                <ListItemText primary={label.name}></ListItemText>
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}

                      {selectedIssue.milestone && (
                        <>
                          Milestone:
                          <ul>
                            <li>{selectedIssue.milestone.title}</li>
                          </ul>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </>
      ) : (
        <EditIssue setDispayInfo={setDispayInfo} assigneesQuery={assigneesQuery} allLabelsQuery={allLabelsQuery} allMilestonesQuery={allMilestonesQuery} selectedIssue={selectedIssue} setEditMode={setEditMode} refetch={refetch}/>
      )}
    </>
  );
};

export default DisplaySelectedIssue;
