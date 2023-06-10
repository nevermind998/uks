import { useState } from 'react';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Grid,
} from '@mui/material';
import { useQuery } from 'react-query';
import { PullRequestDto, ReviewStatusEnum } from '../../../../Types/pull_request.types';
import { fetchCommitsPerBranch } from '../../../../api/commits';
import { CommitDto } from '../../../../Types/commit.types';
import { AccountCircle } from '@mui/icons-material';
import TaskIcon from '@mui/icons-material/Task';
import LabelIcon from '@mui/icons-material/Label';
import { Formik, Form, Field } from 'formik';
import { updatePullRequestReviewStatus, updatePullRequestStatus } from '../../../../api/projectManagement';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import CommentsDisplay from '../../../CommentsDisplay';

const DisplaySelecterPR = ({ selectedPr, setDispayPRInfo }: any) => {
  const [isMerged, setIsMerged] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const commitsQuery = useQuery({
    queryKey: ['FETCH_PULL_REQUEST'],
    queryFn: async () => {
      const commits: CommitDto[] = await fetchCommitsPerBranch(selectedPr.compare_branch);
      return commits;
    },
  });

  const handleApprove = () => {
    updatePullRequestReviewStatus(selectedPr.id).then(() => setIsApproved(true));
  };

  const handleMerge = () => {
    updatePullRequestStatus(selectedPr.id).then(() => setIsMerged(true), setDispayPRInfo(false));
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setDispayPRInfo(false)} className="create-repository__back-button" style={{ color: 'black' }}>
          &#60; Back
        </button>
        <h3>{selectedPr ? selectedPr.title : 'No PR info available'}</h3>

        {!isMerged && (isApproved || selectedPr.review === ReviewStatusEnum.APPROVED) && (
          <Button style={{ height: '30px', borderRadius: '20px' }} variant="contained" onClick={handleMerge}>
            <MergeTypeIcon /> Merge and close
          </Button>
        )}
        {!isApproved && selectedPr.review === ReviewStatusEnum.CHANGES_REQUESTED && (
          <Button style={{ height: '30px', borderRadius: '20px' }} variant="contained" onClick={handleApprove}>
            Add review
          </Button>
        )}
      </div>
      <Divider light />
      <br />

      <div className="pr__single-pr-display">
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
          <Typography variant="body1">
            {selectedPr.author ? (
              <span>
                Author <i>{selectedPr.author.username}</i> has opened a pull request
              </span>
            ) : (
              ''
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
            sx={{ width: '100%' }}
          />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            {commitsQuery.data?.length !== 0 ? (
              <div>
                <p>Commits: </p>
                {commitsQuery.data?.map((commit: any) => (
                  <Card variant="outlined" style={{ width: '400px' }}>
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
                              <AccountCircle fontSize="large" />
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
      <Grid marginTop={2}>
        <Divider> </Divider>
        <CommentsDisplay obj_id={selectedPr.id} isPr={true}></CommentsDisplay>
      </Grid>
    </>
  );
};

export default DisplaySelecterPR;
