import { Chip, Divider, Link } from "@mui/material";
import { useState } from "react";
import { Button, Card, CardContent } from "@mui/material";
import { useQuery } from "react-query";
import { fetchLabel } from "../../../api/projectManagement";
import { useParams } from "react-router-dom";
import { LabelDto } from "../../../Types/label.types";
import DisplaySelectedLabel from "./DisplaySelectedLabel";
import Label from "../../ProjectManagement/LabelForm";


const LabelDisplay = ({setOpen, setToastOptions}) => {
  const { id } = useParams();

  const repositoryId = id ? parseInt(id, 10) : 0;
  const [createLabel, setCreateLabel] = useState<boolean>(false);
  const [dispayInfo, setDispayInfo] = useState<boolean>(false);
  const [selectedLabel, setSelectedLabel] = useState<[] | null>(null);


  const {data: allLabel, refetch} = useQuery({
    queryKey: ["FETCH_LABEL", createLabel],
    queryFn: async () => {
      const allLabel: LabelDto[] = await fetchLabel(repositoryId);
      return allLabel;
    },
  });

  return (
    <div>
      {!createLabel ? (
        <div>
          {!dispayInfo ? (
            <>
              <div className="issues__button-header">
                <Button className="dashboard__create-repo" onClick={() => setCreateLabel(true)} variant="contained">
                  New label
                </Button>             
              </div>
              <Divider light />
              <div className="issues__request-list">
                <div>
                  {allLabel?.length !== 0 ? (
                    allLabel?.map((x: any) => (
                      <div className="issues__pr-display" key={x.id}>
                        <Card variant="outlined" className="pr__pr-display--card">
                          <CardContent>
                            <div className="issues__card-content">
                              <img src="/img/label.png" alt="Label icon" />
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
                                  <Chip label={x.name}></Chip>
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
            <DisplaySelectedLabel selectedLabel={selectedLabel} setDispayInfo={setDispayInfo} refetch={refetch}/>
          )}
        </div>
        )
      :
       <Label setCreateLabel={setCreateLabel}/>
      }
    </div>
  );
};

export default LabelDisplay;
