import { Divider, Link } from "@mui/material";
import { Button, Card, CardContent } from "@mui/material";
import { useQuery } from "react-query";
import { StatusEnum } from "../../../Types/issue.types";
import { fetchOpenedMilestone } from "../../../api/projectManagement";
import { RootState } from "../../../Store";
import { AuthState } from "../../../Store/slices/auth.slice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Link as LinkTo} from 'react-router-dom';
import DisplaySelectedIssue from "../IssueDisplay/DisplaySelectedIssue";
import { MilestoneDto } from "../../../Types/milestone.types";
import { useState } from "react";
import DisplaySelectedMilestone from "./DisplaySelectedMilestone";

const MilestoneDisplay = ({ pr, setToastOptions, setOpen }: any) => {
  const user = useSelector<RootState, AuthState>(state => state.auth);
  const { id } = useParams();

  const repositoryId = id ? parseInt(id, 10) : 0;
  const [createIssue, setCreateIssue] = useState<boolean>(false);
  const [dispayInfo, setDispayInfo] = useState<boolean>(false);
  const [selectedPr, setSelectedPr] = useState<[] | null>(null);

  const allOpenedMilestone = useQuery({
    queryKey: ["FETCH_MILESTONE", createIssue],
    queryFn: async () => {
      const openedMilestones: MilestoneDto[] = await fetchOpenedMilestone(StatusEnum.OPEN, repositoryId);
      return openedMilestones;
    },
  });

  return (
    <div>
        <div>
          {!dispayInfo ? (
            <>
              <div className="issues__button-header">
                <LinkTo to={`/milestone/new/${repositoryId}`}>
                <Button className="dashboard__create-repo" variant="contained">
                  New milestone
                </Button>
                </LinkTo>              
              </div>
              <Divider light />
              <div className="issues__request-list">
                <div>
                  {allOpenedMilestone.data?.length !== 0 ? (
                    allOpenedMilestone.data?.map((x: any) => (
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
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: "center" }}>There aren’t any open milestones. </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <DisplaySelectedMilestone selectedMilestone={selectedPr} setDispayInfo={setDispayInfo} />
          )}
        </div>
    </div>
  );
};

export default MilestoneDisplay;
