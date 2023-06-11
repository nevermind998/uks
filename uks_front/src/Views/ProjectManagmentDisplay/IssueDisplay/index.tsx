import {Divider, Link } from "@mui/material";
import { useState } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useQuery } from "react-query";
import { StatusEnum } from "../../../Types/issue.types";
import { advanceSearchForIssue, fetchOpenedIssue } from "../../../api/projectManagement";
import { useParams } from "react-router-dom";
import Issue from "../../ProjectManagement/IssuesForm";
import { IssuesDto } from "../../../Types/issue.types";
import DisplaySelectedIssue from "./DisplaySelectedIssue";

const IssueDisplay = () => {
  const { id } = useParams();

  const repositoryId = id ? parseInt(id, 10) : 0;
  const [createIssue, setCreateIssue] = useState<boolean>(false);
  const [filterIssue, setFilterIssue] = useState<boolean>(false);
  const [dispayInfo, setDispayInfo] = useState<boolean>(false);
  const [selectedPr, setSelectedPr] = useState<[] | null>(null);
  const [status, setStatus] = useState<string>('');
  const [statusSet, setstatusSet] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [nameSet, setnameSet] = useState<boolean>(false);


  const [query, setQuery] = useState("");

  var {data: allOpenedIssue, refetch} = useQuery({
    queryKey: ["FETCH_ISSUE", createIssue],
    queryFn: async () => {
      var openedIssues: IssuesDto[] = await fetchOpenedIssue(StatusEnum.OPEN, repositoryId);
      return openedIssues;
    },
  });

  var {data: filteredIssues, refetch} = useQuery({
    queryKey: ["FETCH_ISSUE_BY_STATUS", filterIssue],
    queryFn: async () => {
      var openedIssues: IssuesDto[] = await advanceSearchForIssue(status, name);
      return openedIssues;
    },
  });
  
  const extract = (data: string, searchFor: string, step:number) => {
    const startIndex = data.indexOf(searchFor);
    if (startIndex !== -1) {
      const endIndex = data.indexOf(' ', startIndex); 
      const extractedPart = data.substring(startIndex + step, endIndex); 
      return extractedPart;
    }
  };

  const handleSearchChange =   (event: any) => {
    var search = event.target.value;

    if (search.match('state:')) {
        const extractedPart = extract(search, 'state:', 6);
        var issueStatus = '';
        if (extractedPart?.toUpperCase() === StatusEnum.OPEN ){
          issueStatus = StatusEnum.OPEN;
        }else if (extractedPart?.toUpperCase() === StatusEnum.CLOSED ){
          issueStatus = StatusEnum.CLOSED;
        }
        if (issueStatus!='' && issueStatus!=null) {
          setStatus(issueStatus);
          setstatusSet(!statusSet);
        }
    }

    if (search.match('name:')) {
      const nameIssue = extract(search, 'name:',5);
      if (nameIssue!='' && nameIssue!=null) {
        const regex = /name:(\w+)/;
        const match = search.match(regex);
        if (match && match[1]) {
        const nameValue = match[1];
        setnameSet(!setName);
        setName(nameValue);
      }
    }
  }
  }

  const handlFilter = (event: any) => {
    setFilterIssue(!filterIssue);
   /* if (filterIssue === true){
      setnameSet(false);
      setName('');
      setstatusSet(false);
      setStatus('');
    }*/
  }
  
  return (
    <div>
      {filterIssue === true ? (
        <>
           <div className="issues__button-header">
           <input
             type="text"
             placeholder="state:open name:"
             onChange={handleSearchChange}
             className="issues__search"
           />
           <Button onClick={handlFilter}  className="issues__filterSearch">Filter</Button>
           <Button className="dashboard__create-repo" onClick={() => setCreateIssue(true)} variant="contained">
             New issue
           </Button> 
       </div>
       <Divider light />
       <div className="issues__request-list">
         <div>
           {filteredIssues?.length !== 0 ? (
             filteredIssues?.map((x: any) => (
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
             <p style={{ textAlign: "center" }}>There aren’t any issues. </p>
           )}
         </div>
       </div>
       </>
      ) :
      !createIssue ? (
        <div>
          {!dispayInfo ? (
            <>
              <div className="issues__button-header">
                  <input
                    type="text"
                    placeholder="state:open name:"
                    onKeyDown={handleSearchChange}
                    className="issues__search"
                  />
                  <Button onClick={handlFilter}  className="issues__filterSearch">Filter</Button>
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
