import { Divider } from "@mui/material";
import { useState } from "react";
import { Button, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { useQuery } from "react-query";
import { PullRequestDto, StatusEnum } from "../../../Types/pull_request.types";
import { fetchOpenedPrs } from "../../../api/projectManagement";
import { RootState } from "../../../Store";
import { AuthState } from "../../../Store/slices/auth.slice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PullRequest from "../../ProjectManagement/PullRequestForm";
import { Link } from "@mui/material";
import DisplaySelecterPR from "./DisplaySelectedPR";

const PullRequestDisplay = ({ pr, setToastOptions, setOpen, refetch }: any) => {
  const { id } = useParams();

  const repositoryId = id ? parseInt(id, 10) : 0;
  const [createPR, setCreatePR] = useState<boolean>(false);
  const [dispayPRInfo, setDispayPRInfo] = useState<boolean>(false);
  const [selectedPr, setSelectedPr] = useState<[] | null>(null);

  const {data, isLoading} = useQuery({
    queryKey: ["FETCH_PULL_REQUEST", {createPR, dispayPRInfo}],
    queryFn: async () => {
      const openedPrs: PullRequestDto[] = await fetchOpenedPrs(StatusEnum.OPEN, repositoryId);
      return openedPrs;
    },
  });

  

  return (
    <div>
     {isLoading ? (
        <CircularProgress />
      ) : (
      <>
      {!createPR ? (
        <div>
          {!dispayPRInfo ? (
            <>
              <div className="pr__button-header">
                <Button className="dashboard__create-repo" onClick={() => setCreatePR(true)} variant="contained">
                  New pull request
                </Button>
              </div>
              <Divider light />
              <div className="pr__request-list">
                <div>
                  {data?.length !== 0 ? (
                    data?.map((x: any) => (
                      <div className="pr__pr-display" key={x.id}>
                        <Card variant="outlined" className="pr__pr-display--card">
                          <CardContent>
                            <div className="pr__card-content">
                              <img src="/img/comparing-branch.png" alt="User icon" />
                              <div>
                                <Link
                                  className="pr__card-title"
                                  underline="hover"
                                  color="inherit"
                                  variant="h6"
                                  onClick={() => {
                                    setSelectedPr(x);
                                    setDispayPRInfo(true);
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
            <DisplaySelecterPR selectedPr={selectedPr} setDispayPRInfo={setDispayPRInfo} refetchRepo={refetch}/>
          )}
        </div>
      ) : (
        <PullRequest setCreatePR={setCreatePR}></PullRequest>
      )}</>)}
    </div>
  );
};

export default PullRequestDisplay;
