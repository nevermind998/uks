import React from "react";
import Commit from "../../Commit";
import { useQuery } from "react-query";
import { BranchDto, CommitDto } from "../../../Types/commit.types";
import { fetchCommitsPerBranch, getBranchByNameAndRepository } from "../../../api/commits";
import { Edit, Delete } from "@mui/icons-material";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip } from "@mui/material";

const Commits = ({ repo, branch, setToastOptions, setOpen }) => {
  const { data: selectedBranch } = useQuery({
    queryKey: ["FETCH_BRANCH_DATA"],
    queryFn: async () => {
        if (repo.id) {
            const data: BranchDto = await getBranchByNameAndRepository(branch, repo.id);
            return data;
        } else {
            setToastOptions({ message: 'Error happened while fetching branch!', type: 'error' });
            setOpen(true);
        }
    },
  });

  const { data: commits, refetch } = useQuery({
    queryKey: ["FETCH_COMMITS"],
    retry: true,
    queryFn: async () => {
      if (branch) {
        const branchData: BranchDto = await getBranchByNameAndRepository(branch, repo.id);
        const data: CommitDto[] = await fetchCommitsPerBranch(branchData?.id);
        return data;
      } else {
        setToastOptions({ message: "Error happened when fetching commits!", type: "error" });
        setOpen(true);
      }
    },
  });
  

  return (
    <div className="commits">
      <Commit branch={selectedBranch} refetch={refetch}/>
      <div>
      <TableContainer component={Paper} className="commits__table">
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Author</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Hash</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {commits?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(commit => (
                                <TableRow key={commit.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        <Chip label={commit.author?.username} variant="filled" />
                                    </TableCell>
                                    <TableCell component="th" scope="row">{commit.message}</TableCell>
                                    <TableCell component="th" scope="row">{new Date(commit.created_at).toDateString()}</TableCell>
                                    <TableCell component="th" scope="row">{commit.hash}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
      </div>
    </div>
  );
};

export default Commits;
