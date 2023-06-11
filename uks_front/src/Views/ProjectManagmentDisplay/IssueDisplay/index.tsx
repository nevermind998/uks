import { Box, Divider, Link, Tab } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useQuery } from "react-query";
import { StatusEnum } from "../../../Types/issue.types";
import { fetchOpenedIssue } from "../../../api/projectManagement";
import { RootState } from "../../../Store";
import { AuthState } from "../../../Store/slices/auth.slice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Issue from "../../ProjectManagement/IssuesForm";
import { IssuesDto } from "../../../Types/issue.types";
import { Link as LinkTo} from 'react-router-dom';
import DisplaySelectedIssue from "./DisplaySelectedIssue";
import { TabContext, TabList, TabPanel } from '@mui/lab';
import LabelDisplay from "../LabelDisplay";
import MilestoneDisplay from "../MilestoneDisplay";



const IssueDisplay = ({ pr, setToastOptions, setOpen }: any) => {
  const user = useSelector<RootState, AuthState>(state => state.auth);
  const { id } = useParams();

  const repositoryId = id ? parseInt(id, 10) : 0;
  const [createIssue, setCreateIssue] = useState<boolean>(false);
  const [dispayInfo, setDispayInfo] = useState<boolean>(false);
  const [selectedPr, setSelectedPr] = useState<[] | null>(null);
  const [tab, setTab] = useState('');


  const allOpenedIssue = useQuery({
    queryKey: ["FETCH_ISSUE", createIssue],
    queryFn: async () => {
      const openedIssues: IssuesDto[] = await fetchOpenedIssue(StatusEnum.OPEN, repositoryId);
      return openedIssues;
    },
  });

  
  const handleChange = (event: SyntheticEvent, newTab: string) => {
    setTab(newTab);
};

  return (
    <div>
      {!createIssue ? (
        <div>
          {!dispayInfo ? (
            <>
              <div className="issues__button-header">

               <TabContext value={tab}>
                        <Box sx={{ borderBottom: 1, borderTop: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange}>
                                <Tab label="Label" value="1" />
                                <Tab label="Milestone" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                          <LabelDisplay setOpen={setOpen} setToastOptions={setToastOptions}></LabelDisplay>
                        </TabPanel>
                        <TabPanel value="2">
                          <MilestoneDisplay setOpen={setOpen} setToastOptions={setToastOptions}></MilestoneDisplay>
                        </TabPanel>
                </TabContext>

                <LinkTo to={`/issue/new/${repositoryId}`}>
                <Button className="dashboard__create-repo" onClick={() => setCreateIssue(true)} variant="contained">
                  New issues
                </Button>
                </LinkTo>              
              </div>
              <Divider light />
              <div className="issues__request-list">
                <div>
                  {allOpenedIssue.data?.length !== 0 ? (
                    allOpenedIssue.data?.map((x: any) => (
                      <div className="issues__pr-display" key={x.id}>
                        <Card variant="outlined" className="pr__pr-display--card">
                          <CardContent>
                            <div className="issues__card-content">
                              <img src="/img/comparing-branch.png" alt="User icon" />
                              <div>
                                <Link
                                  className="issues__card-title"
                                  underline="hover"
                                  color="inherit"
                                  variant="h6"
                                  onClick={() => {
                                    setSelectedPr(x);
                                    setDispayInfo(true);
                                  }}
                                >
                                  {x.title}
                                </Link>
                                <Typography variant="caption" component="div">
                                  {x.status ? "OPENED" : "CLOSED"} by {x.author.given_name} {x.author.family_name}
                                </Typography>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: "center" }}>There aren’t any open pull requests. </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <DisplaySelectedIssue selectedIssue={selectedPr} setDispaylInfo={setDispayInfo} />
          )}
        </div>
      ) : (
   
        <Issue setCreateIssue={setCreateIssue}></Issue>
      )}
    </div>
  );
};

export default IssueDisplay;
