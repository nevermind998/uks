import { useState } from "react";
import { Button, TextField, Card, CardContent, Typography, Divider, Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { useQuery } from "react-query";
import { PullRequestDto } from "../../../../Types/pull_request.types";
import { fetchCommitsPerBranch } from "../../../../api/commits";
import { CommitDto } from "../../../../Types/commit.types";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TaskIcon from "@mui/icons-material/Task";
import LabelIcon from "@mui/icons-material/Label";

const DisplaySelecterPR = ({ selectedPr, setDispayPRInfo }: any) => {
  const [reviewStatus, setReviewStatus] = useState("");
  const [updatedSelectedPr, setUpdatedSelectedPr] = useState<PullRequestDto | null>(null);

  const commitsQuery = useQuery({
    queryKey: ["FETCH_PULL_REQUEST"],
    queryFn: async () => {
      const commits: CommitDto[] = await fetchCommitsPerBranch(selectedPr.compare_branch);
      return commits;
    },
  });

  // const changeReviewStatus = () => {
  //     const updatedSelectedPr = { ...selectedPr, reviewStatus: ReviewStatusEnum.APPROVED };
  //     setReviewStatus(ReviewStatusEnum.APPROVED );
  //     setUpdatedSelectedPr(updatedSelectedPr);
  // };
  // console.log(selectedPr);

  // const milestoneData = milestone ? milestone[0].title : "";
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setDispayPRInfo(false)} className="create-repository__back-button" style={{ color: "black" }}>
          &#60; Back
        </button>
        <h3>{selectedPr ? selectedPr.title : "No PR info available"}</h3>
        <Button style={{ height: "30px", borderRadius: "20px" }} variant="contained">
          Add review
        </Button>
      </div>
      <Divider light />
      <br />

      <div className="pr__single-pr-display">
        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "10px" }}>
          <Typography variant="body1">
            {selectedPr.author ? (
              <span>
                Author <i>{selectedPr.author.username}</i> has opened a pull request
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
            value={selectedPr.description}
            InputProps={{
              readOnly: true,
            }}
            sx={{ width: "100%" }}
          />
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            {commitsQuery.data?.length !== 0 ? (
              <div>
                <p>Commits: </p>
                {commitsQuery.data?.map((commit: any) => (
                  <Card variant="outlined" style={{ width: "400px" }}>
                    <>
                      <CardContent>
                        <div>
                          <Typography variant="caption" component="div">
                            {commit.message}
                          </Typography>
                        </div>
                      </CardContent>
                    </>
                  </Card>
                ))}
              </div>
            ) : (
              <p>There are no commits for this pull request</p>
            )}
          </div>
        </div>

        {(selectedPr.assignees.length !== 0 || selectedPr.issues.length !== 0 || selectedPr.labels.length !== 0 || selectedPr.milestone) && (
          <>
            <Card variant="outlined" className="pr__more-info">
              <CardContent>
                <div>
                  {selectedPr.assignees.length !== 0 && (
                    <>
                      Assignees:
                      <List>
                        {selectedPr.assignees.map((assignee: any) => (
                          <ListItem key={assignee.id}>
                            <ListItemAvatar>
                              <AccountCircleIcon fontSize="large" />
                            </ListItemAvatar>
                            <ListItemText primary={`${assignee.given_name} ${assignee.family_name}`}></ListItemText>
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}

                  {selectedPr.issues.length !== 0 && (
                    <>
                      Issues:
                      <List>
                        {selectedPr.issues.map((issue: any) => (
                          <ListItem key={issue.id}>
                            <ListItemAvatar>
                              <TaskIcon fontSize="large" />
                            </ListItemAvatar>
                            <ListItemText primary={issue.title}></ListItemText>
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}

                  {selectedPr.labels.length !== 0 && (
                    <>
                      Labels:
                      <List>
                        {selectedPr.labels.map((label: any) => (
                          <ListItem key={label.id}>
                            <ListItemAvatar>
                              <LabelIcon fontSize="large" />
                            </ListItemAvatar>
                            <ListItemText primary={label.name}></ListItemText>
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}

                  {selectedPr.milestone && (
                    <>
                      Milestone:
                      <p>{selectedPr.milestone.title}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default DisplaySelecterPR;
