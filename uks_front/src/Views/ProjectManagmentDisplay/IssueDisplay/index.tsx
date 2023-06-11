import {Divider, Link } from "@mui/material";
import { useState } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useQuery } from "react-query";
import { StatusEnum } from "../../../Types/issue.types";
import { fetchOpenedIssue } from "../../../api/projectManagement";
import { useParams } from "react-router-dom";
import Issue from "../../ProjectManagement/IssuesForm";
import { IssuesDto } from "../../../Types/issue.types";
import DisplaySelectedIssue from "./DisplaySelectedIssue";

const IssueDisplay = () => {
  const { id } = useParams();

  const repositoryId = id ? parseInt(id, 10) : 0;
  const [createIssue, setCreateIssue] = useState<boolean>(false);
  const [dispayInfo, setDispayInfo] = useState<boolean>(false);
  const [selectedPr, setSelectedPr] = useState<[] | null>(null);

  const {data: allOpenedIssue, refetch} = useQuery({
    queryKey: ["FETCH_ISSUE", createIssue],
    queryFn: async () => {
      const openedIssues: IssuesDto[] = await fetchOpenedIssue(StatusEnum.OPEN, repositoryId);
      return openedIssues;
    },
  });

  return (
    <div>
      {!createIssue ? (
        <div>
          {!dispayInfo ? (
            <>
              <div className="issues__button-header">
                  <Button className="dashboard__create-repo" onClick={() => setCreateIssue(true)} variant="contained">
                    New issue
                  </Button>
              </div>
              <Divider light />
              <div className="issues__request-list">
                <div>
                  {allOpenedIssue?.length !== 0 ? (
                    allOpenedIssue?.map((x: any) => (
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
            <DisplaySelectedIssue selectedIssue={selectedPr} setDispayInfo={setDispayInfo} refetch={refetch}/>
          )}
        </div>
      ) : (
        <Issue setCreateIssue={setCreateIssue}></Issue>
      )}
    </div>
  );
};

export default IssueDisplay;
