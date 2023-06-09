import { Badge, Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState } from 'react';
import Branch from '../../Branch';
import { Button, ButtonBase, Card, CardContent, Chip, CircularProgress, LinearProgress, Typography, Tabs } from '@mui/material';
import { useQuery } from 'react-query';
import { PullRequestDto, StatusEnum } from '../../../Types/pull_request.types';
import { fetchBranchesByRepo, fetchOpenedPrs, fetchPullRequestsByAuthor, getPRbyId } from '../../../api/projectManagement';
import { RootState } from '../../../Store';
import { AuthState } from '../../../Store/slices/auth.slice';
import { useSelector } from "react-redux";
import { BranchDto } from '../../../Types/commit.types';
import { useParams } from 'react-router-dom';
import { fetchBranches } from '../../../api/commits';
import PullRequest from '../../ProjectManagement/PullRequestForm';
import { getUserById } from '../../../api/userAuthentication';
import { UserProfileDto } from '../../../Types/user.types';
import { Box, Breadcrumbs, Link } from '@mui/material';
import DisplaySelecterPR from './DisplaySelectedPR';
import { useNavigate } from 'react-router-dom';

const PullRequestDisplay = ({ pr, setToastOptions, setOpen }: any) => {
  const [tab, setTab] = useState('pull_request');
  const user = useSelector<RootState, AuthState>(state => state.auth);
  const { id } = useParams();

  const repositoryId = id ?  parseInt(id, 10) : 0;
  const [createPR, setCreatePR] = useState<boolean>(false);
  const [dispayPRInfo, setDispayPRInfo] = useState<boolean>(false);
  const [selectedPr, setSelectedPr] = useState<[] | null>(null);

  let prAuthor;

  const allOpenedPullRequest = useQuery({
    queryKey: ['FETCH_PULL_REQUEST', createPR],
    queryFn: async () => {
      const openedPrs: PullRequestDto[] = await fetchOpenedPrs(StatusEnum.OPEN, repositoryId);
      return openedPrs;
    },
  });

  return (
    <>
      {tab === 'pull_request' && (
        <div>
          {!createPR ? (
          <div>
            {!dispayPRInfo ? (
              <>
          <div style={{ marginLeft:"1470px", paddingBottom:"20px"}}>
            <Button className="dashboard__create-repo" onClick={() => setCreatePR(true)} variant="contained">
                New pull request
            </Button>
          </div>
          <Divider light />
          <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
              <div>
              {allOpenedPullRequest.data?.length != 0 ? (
                allOpenedPullRequest.data?.map((x:any) => (
                <div className='pr__pr-display__content-wrapper-display'>
                <Card variant="outlined" className="pr__pr-display--card">
                  <>
                  <CardContent>
                    <div style={{display:"flex", flexDirection:"row", gap:"15px"}}>
                    <img src="/img/comparing-branch.png" alt="User icon" style={{ width: '3%' }} />
                      <div className="pr__pr_-display--card-title">
                        <Link underline="hover" color="inherit" variant='h6' 
                              onClick={() => {
                                setSelectedPr(x);
                                setDispayPRInfo(true);
                              }}
                        >
                          {x.title}
                        </Link>
                        <Typography variant="caption" component="div">
                          {x.status ? "OPENED" : "CLOSED"} by {x.author}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                  </>
                </Card></div>))) : (<p style={{textAlign:"center"}}>There aren’t any open pull requests. </p>)}
              </div>
            </div></>
              ) : (<DisplaySelecterPR selectedPr={selectedPr} setDispayPRInfo={setDispayPRInfo}/>)}
          </div>
          ) :  (<PullRequest setCreatePR={setCreatePR} ></PullRequest>)
          }
        </div>
      )}
    </>
  );
};

export default PullRequestDisplay;
