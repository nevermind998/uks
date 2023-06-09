import { useState, useEffect } from 'react';
import { Button,TextField, Card, CardContent, Chip, CircularProgress, LinearProgress, Typography, Tabs, Divider } from '@mui/material';
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { RootState } from '../../../../Store';
import { AuthState } from '../../../../Store/slices/auth.slice';
import { useQuery } from 'react-query';
import { PullRequestDto, ReviewStatusEnum } from '../../../../Types/pull_request.types';
import { getIssuesIds, getLabelsById, getMilestoneById, getPRbyId } from '../../../../api/projectManagement';
import { fetchCommitsPerBranch } from '../../../../api/commits';
import { CommitDto } from '../../../../Types/commit.types';
import { getUserById } from '../../../../api/userAuthentication';
import { IssuesDto, IssuesIdDto,MilestoneIdDto, MilestoneDto, UserProfileDto, LabelDto, LabelIdDto } from '../../../../Types/user.types';

const DisplaySelecterPR = ({selectedPr, setDispayPRInfo}: any) => {
    const [assignees, setAssignees] = useState<string[]>([]);
    const [issues, setIssues] = useState<string[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [reviewStatus, setReviewStatus] = useState('');
    const [updatedSelectedPr, setUpdatedSelectedPr] = useState<PullRequestDto | null>(null);

    const commitsQuery = useQuery({
        queryKey: ['FETCH_PULL_REQUEST'],
        queryFn: async () => {
          const commits: CommitDto[] = await fetchCommitsPerBranch(selectedPr.compare_branch);
          return commits;
        },
    });
    
    const {data: user} = useQuery({
        queryKey: ['FETCH_USER'],
        queryFn: async () => {
        const u: UserProfileDto[] = await getUserById(selectedPr.author);
        return u;
        },
    });

    useEffect(() => {
        const fetchAssigneeNames = async () => {
            const assigneeNames: string[] = await Promise.all(
              selectedPr.assignees.map(async (id: any) => {
                const users: UserProfileDto[] = await getUserById(id);
                const user = users.find((u: UserProfileDto) => u.id === id);
                return user ? user.username : '';
              })
            );
            setAssignees(assigneeNames);
        };
        fetchAssigneeNames();
      
    
        // const fetchIssues = async () => {
        //     const issueTitles: string[] = await Promise.all(
        //       selectedPr.issues.map(async (id: any) => {
        //         const issues: IssuesIdDto[] = await getIssuesIds(id);
        //         const issue = issues.find((u: IssuesIdDto) => u.id === id);
        //         return issue ? issue.title : '';
        //       })
        //     );
        //     setIssues(issueTitles);
        // };
        // fetchIssues();

        // const fetchLabels = async () => {
        //     const labelTitles: string[] = await Promise.all(
        //       selectedPr.labels.map(async (id: any) => {
        //         const labels: LabelIdDto[] = await getLabelsById(id);
        //         const label = labels.find((u: LabelIdDto) => u.id === id);
        //         return label ? label.name : '';
        //       })
        //     );
        //     setLabels(labelTitles);
        // };
        // fetchLabels();


    },[selectedPr.assigneeNames, selectedPr.issueTitles, selectedPr.labelTitles]);

    const {data: milestone} = useQuery({
        queryKey: ['FETCH_MIL'],
        queryFn: async () => {
            const m: MilestoneIdDto[] = await getMilestoneById(selectedPr.milestone);
            return m;
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
            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>      
                <button onClick={() => setDispayPRInfo(false)} className="create-repository__back-button">
                    &#60; Back
                </button>
                <h6 style={{fontSize:"16px", marginTop:"10px"}}>{selectedPr ? selectedPr.title : 'No PR info available'}</h6>
                <Button style={{height:"30px"}} variant="contained">
                    Add review
                </Button>
            </div>
            <Divider light />
            <br/>
                <div style={{display:"flex", flexDirection:"column"}}>
                <Typography variant="body1">
                    {user ? (
                        <span>
                        Author <i>{user[0].username}</i> has opened a pull request
                        </span>
                    ) : (
                        ''
                    )}
                </Typography>
                <TextField
                    variant="outlined"
                    name="description"
                    className="add-pull-request-form__form--field"
                    size="medium"
                    multiline
                    rows={3}
                    value={selectedPr.description}
                    InputProps={{
                        readOnly: true,
                    }}
                    sx={{ width: "1680px" }}
                    />
                </div>
                <br/>
                <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                    {commitsQuery.data?.length != 0  ? (
                        <div> 
                        <p>Commits: </p>
                        {commitsQuery.data?.map((commit:any) =>(
                        <Card variant="outlined" style={{width:"400px"}}>
                        <>
                        <CardContent>
                            <div>
                                <Typography variant="caption" component="div">
                                 {commit.message }
                                </Typography>
                            </div>
                        </CardContent>
                         </>
                        </Card>))}</div>) : (<p>There are no commits for this pull request</p>)}
                        
                        <Divider orientation='vertical' flexItem></Divider>
                        
                        <Card variant="outlined" >
                        <>
                        <CardContent>
                            <div >
                                <Typography variant="caption" component="div">
                                    Assignees: {assignees.join(', ')}
                                </Typography>
                                <Divider light />
                                <Typography variant="caption" component="div">
                                    {/* Labels: {labels.join(', ')} */}
                                </Typography>
                                <Divider light />
                                <Typography variant="caption" component="div">
                                    {/* Milestone: {milestoneData} */}
                                </Typography>
                                <Typography variant="caption" component="div">
                                    {/* Issues: {issues.join(', ')} */}
                                </Typography>
                                <Divider light />
                            </div>
                        </CardContent>
                         </>
                        </Card> 
                </div>

        </>
    );
};

export default DisplaySelecterPR;
