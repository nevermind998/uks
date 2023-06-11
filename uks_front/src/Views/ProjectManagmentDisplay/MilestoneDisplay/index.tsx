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
import { MilestoneDto } from "../../../Types/milestone.types";
import { useState } from "react";
import DisplaySelectedMilestone from "./DisplaySelectedMilestone";
import Milestone from "../../ProjectManagement/MilestoneForm";

const MilestoneDisplay = ({ pr, setToastOptions, setOpen }: any) => {
  const { id } = useParams();

  const repositoryId = id ? parseInt(id, 10) : 0;
  const [createMilestone, setcreateMilestone] = useState<boolean>(false);
  const [dispayInfo, setDispayInfo] = useState<boolean>(false);
  const [selectedPr, setSelectedPr] = useState<[] | null>(null);

  const {data: allOpenedMilestone, refetch} = useQuery({
    queryKey: ["FETCH_MILESTONE", createMilestone],
    queryFn: async () => {
      const openedMilestones: MilestoneDto[] = await fetchOpenedMilestone(StatusEnum.OPEN, repositoryId);
      return openedMilestones;
    },
  });

  return (
    <div>
      {!createMilestone ? (
        <div>
          {!dispayInfo ? (
            <>
              <div className="issues__button-header">
                <Button className="dashboard__create-repo" onClick={() => setcreateMilestone(true)} variant="contained">
                  New milestone
                </Button>             
              </div>
              <Divider light />
              <div className="issues__request-list">
                <div>
                  {allOpenedMilestone?.length !== 0 ? (
                    allOpenedMilestone?.map((x: any) => (
                      <div className="issues__pr-display" key={x.id}>
                        <Card variant="outlined" className="pr__pr-display--card">
                          <CardContent>
                            <div className="issues__card-content">
                              <img src="/img/milestone.png" alt="User icon" />
                              <div className="milestone__card">
                                <Link
                                  className="milestone__card"
                                  underline="hover"
                                  color="inherit"
                                  variant="h6"
                                  onClick={() => {
                                    setSelectedPr(x);
                                    setDispayInfo(true);
                                  }}
                                >
                                  {x.title}
                                <span className="milestone__date">{new Date(x.due_date).toLocaleDateString()}</span>
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
            <DisplaySelectedMilestone selectedMilestone={selectedPr} setDispayInfo={setDispayInfo} refetch={refetch}/>
          )}
        </div>
        ) :
        <Milestone setCreateMilestone={setcreateMilestone} refetch={refetch}/>
      }
    </div>
  );
};

export default MilestoneDisplay;
