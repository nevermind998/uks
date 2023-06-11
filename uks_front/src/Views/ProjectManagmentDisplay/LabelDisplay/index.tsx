import { Divider, Link } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Button, Card, CardContent } from "@mui/material";
import { useQuery } from "react-query";
import { fetchLabel } from "../../../api/projectManagement";
import { RootState } from "../../../Store";
import { AuthState } from "../../../Store/slices/auth.slice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Issue from "../../ProjectManagement/IssuesForm";
import { Link as LinkTo} from 'react-router-dom';
import { LabelDto } from "../../../Types/label.types";
import DisplaySelectedLabel from "./DisplaySelectedLabel";


const LabelDisplay = ({ pr, setToastOptions, setOpen }: any) => {
  const user = useSelector<RootState, AuthState>(state => state.auth);
  const { id } = useParams();

  const repositoryId = id ? parseInt(id, 10) : 0;
  const [createLabel, setCreateLabel] = useState<boolean>(false);
  const [dispayInfo, setDispayInfo] = useState<boolean>(false);
  const [selectedLabel, setSelectedLabel] = useState<[] | null>(null);
  const [tab, setTab] = useState('');


  const allLabel = useQuery({
    queryKey: ["FETCH_LABEL", createLabel],
    queryFn: async () => {
      const allLabel: LabelDto[] = await fetchLabel(repositoryId);
      return allLabel;
    },
  });

  return (
    <div>
        <div>
          {!dispayInfo ? (
            <>
              <div className="issues__button-header">
                <LinkTo to={`/label/new/${repositoryId}`}>
                <Button className="dashboard__create-repo" variant="contained">
                  New label
                </Button>
                </LinkTo>              
              </div>
              <Divider light />
              <div className="issues__request-list">
                <div>
                  {allLabel.data?.length !== 0 ? (
                    allLabel.data?.map((x: any) => (
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
                                    setSelectedLabel(x);
                                    setDispayInfo(true);
                                  }}
                                >
                                  {x.name}
                                </Link>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: "center" }}>There aren’t any label</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <DisplaySelectedLabel selectedLabel={selectedLabel} setDispayInfo={setDispayInfo} />
          )}
        </div>
    </div>
  );
};

export default LabelDisplay;
