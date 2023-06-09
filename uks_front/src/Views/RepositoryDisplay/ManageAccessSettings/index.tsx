import { Edit } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { getAllUsers } from "../../../api/userAuthentication";
import { useMutation, useQuery } from "react-query";
import { editRepo } from "../../../api/repositories";

const ManageAccess = ({ repo, refetch }: any) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedCollaborators, setSelectedCollaborators] = useState<any>([]);

  const { data: users } = useQuery({
    queryKey: ["FETCH_USERS"],
    refetchOnMount: true,
    queryFn: async () => {
      const data: any[] = await getAllUsers();
      return data;
    },
  });

  const { mutate: addCollaborators } = useMutation(editRepo, {
    onSuccess: res => {
      setOpenModal(false);
    },
    onError: () => {
      console.log("greska greskica");
    },
  });

  const handleAdd = () => {
    console.log(
      selectedCollaborators.map((x: any) => {
        return { id: x.value, role: "READ" };
      })
    );

    const body = {
      ...repo,
      collaborators: selectedCollaborators.map((x: any) => {
        return { id: x.value, role: "READ" };
      }),
    };

    addCollaborators(body);
  };

  function isOptionEqualToValue(option: any, value: any) {
    if (value.value === "") return true;
    return option.value === value.value;
  }

  const possibleCollaborators = users?.filter((u: any) => {
    return !repo.collaborators.some((collaborator: any) => collaborator.id === u.id) && u.id !== repo.owner;
  });

  return (
    <div className="manage-access">
      <div className="manage-access__button">
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Add Collaborator
        </Button>
      </div>
      <TableContainer component={Paper} className="branch-settings__table">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {repo.collaborators.map((collaborator: any) => (
              <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Chip label={collaborator.username} variant="filled" />
                </TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <div className="modal-dialog-form__content-wrapper">
          <h3>Add Collaborators</h3>
          <DialogContent style={{ width: "90%", display: "flex", justifyContent: "center" }}>
            <Autocomplete
              style={{ width: "100%" }}
              disablePortal
              id="branches"
              options={possibleCollaborators?.map((b: any) => ({ value: b.id, label: `${b.family_name} ${b.given_name}` })) || []}
              isOptionEqualToValue={isOptionEqualToValue}
              onChange={(event, value: any) => {
                setSelectedCollaborators([...selectedCollaborators, { value: value.value, label: value.label }]);
              }}
              sx={{ width: 180 }}
              size="small"
              renderInput={(params: any) => <TextField {...params} />}
            />
          </DialogContent>

          <DialogActions>
            <Button type="submit" className="add-update__button" variant="contained" onClick={handleAdd}>
              Add
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
};

export default ManageAccess;
