import { useState } from 'react';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grid,
  Popover,
  TableContainer,
  Chip,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useQuery, useMutation } from 'react-query';
import { PullRequestDto, PullRequestEditDto, ReviewStatusEnum } from '../../../../Types/pull_request.types';
import { fetchCommitsPerBranch } from '../../../../api/commits';
import { CommitDto } from '../../../../Types/commit.types';
import { AccountCircle } from '@mui/icons-material';
import TaskIcon from '@mui/icons-material/Task';
import LabelIcon from '@mui/icons-material/Label';
import { editPRDescription, updatePullRequestReviewStatus, updatePullRequestStatus } from '../../../../api/projectManagement';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import CommentsDisplay from '../../../CommentsDisplay';
import { CommentDto } from '../../../../Types/action.types';
import { addNewComment, getCommentsForPr } from '../../../../api/comments';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../../../Store/slices/auth.slice';
import Toast, { ToastOptions } from '../../../../Components/Common/Toast';
import { useFormik } from 'formik';
import { PULL_REQUEST_SCHEMA } from '../../../ProjectManagement/PullRequestForm/pullRequestValidationSchema';  
import { Edit } from '@mui/icons-material';

const DisplaySelecterPR = ({ selectedPr, setDispayPRInfo}: any) => {
  const user = useSelector(selectAuth);
  const [isMerged, setIsMerged] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [reviewType, setReviewType] = useState('approve');
  const [comment, setComment] = useState('');
  const [open, setOpen] = useState<boolean>(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({
    message: '',
    type: 'info',
  });
  const [editPR, setEditPR] = useState<PullRequestEditDto>();
  const [openModal, setModalEditOpen] = useState(false);
  const [openToast, setOpenToast] = useState(false);

  const handleReviewTypeChange = (event) => {
    setReviewType(event.target.value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async () => {
    if (reviewType === 'approve') {
      updatePullRequestReviewStatus(selectedPr.id, ReviewStatusEnum.APPROVED).then(() => setIsApproved(true));
    } else {
      updatePullRequestReviewStatus(selectedPr.id, ReviewStatusEnum.CHANGES_REQUESTED);
    }
    //create comment if needed
    if (comment !== '') {
      const body: CommentDto = {
        author: user.id,
        content: ' requested changes: ' + comment,
        pull_request: selectedPr.id,
      };
      const newComment = await addNewComment(body);
    }
    refetch();
    handleClose();
    setComment('');
    setReviewType('approve');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = () => {
    setEditPR(selectedPr); 
    setModalEditOpen(true);
  };

  const handleCloseEditPR = () => {
    setModalEditOpen(false);
  };

  const openpop = Boolean(anchorEl);
  const id = openpop ? 'add-review-popover' : undefined;

  const { data: commitsQuery } = useQuery({
    queryKey: ['FETCH_PULL_REQUEST'],
    queryFn: async () => {
      const commits: CommitDto[] = await fetchCommitsPerBranch(selectedPr.compare_branch);
      return commits;
    },
  });

  const handleApprove = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMerge = () => {
    updatePullRequestStatus(selectedPr.id).then(() => setIsMerged(true), setDispayPRInfo(false));
  };

  const { data: comments, refetch } = useQuery({
    queryKey: ['FETCH_COMMENTS'],
    queryFn: async () => {
      try {
        const data: CommentDto[] = await getCommentsForPr(selectedPr.id);
        return data;
      } catch {
        setToastOptions({ message: 'Error happened!', type: 'error' });
        setOpen(true);
      }
    }});

  const formik = useFormik({
    initialValues: {
      description: selectedPr.description,
    },
    onSubmit: (values) => {
      const body = {
        id: editPR?.id,
        description: values.description,
      };
      editPRDescription(body); 
      setDispayPRInfo(false);  
      setOpenToast(true);
    },
  });

  return (
    <>
      <Toast open={open} setOpen={setOpen} toastOptions={toastOptions} />
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
          <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: "10px" }}>
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
          <Edit
                      onClick={() => {
                        setEditPR(selectedPr.description);
                        handleClickOpen();
                      }}
                      sx={{ cursor: 'pointer' }}
                    />
                    </div>
          <div>
            {commitsQuery?.length !== 0 ? (
              <TableContainer component={Paper} className="commit__table">
                <Table aria-label="simple table" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Author</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Hash</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {commitsQuery
                      ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((commit) => (
                        <TableRow key={commit.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row">
                            <Chip label={commit.author?.username} variant="filled" />
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {commit.message}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {new Date(commit.created_at).toDateString()}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {commit.hash}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
        <Divider variant="fullWidth" style={{ marginTop: '40px' }} />
        <CommentsDisplay obj_id={selectedPr.id} isPr={true} comments={comments} refetch={refetch}></CommentsDisplay>
      </Grid>
      <Popover
        id={id}
        open={openpop}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div style={{ padding: '16px' }}>
          <Typography variant="h6" marginBottom={2}>
            Add Review
          </Typography>
          <TextField label="Comment" fullWidth multiline rows={3} value={comment} onChange={handleCommentChange} />
          <RadioGroup sx={{ marginTop: '16px' }} value={reviewType} onChange={handleReviewTypeChange}>
            <FormControlLabel value="approve" control={<Radio />} label="Approve" />
            <FormControlLabel value="requestChanges" control={<Radio />} label="Request Changes" />
          </RadioGroup>
          <div className="repository__review_btn">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </Popover>

      <Dialog open={openModal} onClose={handleCloseEditPR}>
        <div className="modal-dialog-form__content-wrapper">
          <h3>
            Edit description
          </h3>
          <div className="modal-dialog-form__form">
            <form onSubmit={formik.handleSubmit} className="modal-dialog-form__form">
              <DialogContent>
              <TextField
                id="description"
                variant="outlined"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="description"
                error={formik.touched.description && Boolean(formik.errors.description)}
                // helperText={formik.touched.description && formik.errors.description}
                required
                className="modal-dialog-form__form--field"
                size="small"
              />
              </DialogContent>

              <DialogActions>
                <Button type="submit" className="add-update__button" variant="contained">
                  Edit
                </Button>
              </DialogActions>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DisplaySelecterPR;
