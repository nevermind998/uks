import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { getAllUsers } from "../../../api/userAuthentication";
import { useMutation, useQuery } from "react-query";
import { deleteCollaborator, deleteRepo, editRepo, getCollaborators, updateRoles } from "../../../api/repositories";
import Toast, { ToastOptions } from "../../../Components/Common/Toast";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { Delete } from "@mui/icons-material";

const accessLevels = ["READ", "WRITE", "ADMIN"];
const visibilityLevels = ["PRIVATE", "PUBLIC"];

const ManageAccess = ({ repo, refetchRepo }: any) => {
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedCollaborators, setSelectedCollaborators] = useState<any>([]);

  const [openToast, setOpenToast] = useState(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: "", type: "info" });

  const { data: users } = useQuery({
    queryKey: ["FETCH_USERS"],
    refetchOnMount: true,
    queryFn: async () => {
      const data: any[] = await getAllUsers();
      return data;
    },
  });

  const { data: collaborations, refetch } = useQuery({
    queryKey: ["collaborations"],
    refetchOnMount: true,
    queryFn: async () => {
      const promises = repo.collaborators.map(async (userId: number) => await getCollaborators(repo.id, userId));
      const results = await Promise.all(promises);
      return results;
    },
  });

  const { mutate: editRole } = useMutation(updateRoles, {
    onSuccess: res => {
      setToastOptions({ message: "Successfully updated users role!", type: "success" });
      setOpenToast(true);
      refetch();
    },
    onError: () => {
      setToastOptions({ message: "An error happened while updating users role!", type: "error" });
      setOpenToast(true);
    },
  });

  const { mutate: updateRepoInformation } = useMutation(editRepo, {
    onSuccess: res => {
      setOpenModal(false);
      setToastOptions({ message: "Successfully added collaborator!", type: "success" });
      setOpenToast(true);
      refetchRepo();

      setTimeout(() => {
        refetch();
      }, 300)
    },
    onError: () => {
      setToastOptions({ message: "An error happened while adding a new collaborator!", type: "error" });
      setOpenToast(true);
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
      owner: repo.owner.id,
      collaborators: selectedCollaborators.map((x: any) => {
        return { id: x.value, role: "READ" };
      }),
    };

    updateRepoInformation(body);
  };

  const handleEdit = (collaborator: any, event: SelectChangeEvent<any>) => {
    const body = {
      id: collaborator.id,
      user: collaborator.user.id,
      role: event.target.value,
      repository: repo.id,
    };

    editRole(body);
  };

  function isOptionEqualToValue(option: any, value: any) {
    if (value.value === "") return true;
    return option.value === value.value;
  }

  const possibleCollaborators = users?.filter((u: any) => {
    const isCollaborator = repo.collaborators.some((collaborator: any) => collaborator === u.id);
    const isNotOwner = u.id !== repo.owner.id;
    return !isCollaborator && isNotOwner;
  });

  const formik = useFormik({
    initialValues: {
      name: repo.name,
      visibility: repo.visibility,
    },
    onSubmit: values => {
      const body = {
        ...repo,
        owner: repo.owner.id,
        name: values.name,
        visibility: values.visibility,
      };

      updateRepoInformation(body);
    },
  });

  const { mutate: deleteRepository } = useMutation(deleteRepo, {
    onSuccess: res => {
      setToastOptions({ message: "Repository successfully deleted", type: "success" });
      setOpenToast(true);
      setDeleteOpen(false);
      window.location.href = "/";
    },
    onError: () => {
      setToastOptions({ message: "This repository could not be deleted!", type: "error" });
      setOpenToast(true);
    },
  });

  const { mutate: deleteCollab } = useMutation(deleteCollaborator, {
    onSuccess: res => {
      setToastOptions({ message: "Collaborator successfully removed", type: "success" });
      setOpenToast(true);
      refetchRepo();

      setTimeout(() => {
        refetch();
      }, 300)
    },
    onError: () => {
      setToastOptions({ message: "This collaborator could not be removed!", type: "error" });
      setOpenToast(true);
    },
  });

  const onConfirmDelete = () => {
    if (repo) deleteRepository(repo.id);
  };

  return (
    <div className="manage-access">
      <Toast open={openToast} setOpen={setOpenToast} toastOptions={toastOptions} />
      <div className="manage-access__general">
        <h4>Edit General Repository Info</h4>
        <form onSubmit={formik.handleSubmit} className="manage-access__general--form">
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            value={formik.values.name}
            onChange={formik.handleChange}
            name="name"
            error={formik.touched.name && Boolean(formik.errors.name)}
            required
            className="manage-access__general--form-field"
            size="small"
          />
          <Select name="visibility" className="manage-access__general--form-field" value={formik.values.visibility} onChange={formik.handleChange}>
            {visibilityLevels.map(level => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
          <div className="manage-access__general--buttons">
            <Button type="submit" variant="contained">
              Save Changes
            </Button>

            <Button variant="contained" onClick={() => setDeleteOpen(true)}>
              Delete Repository
            </Button>
          </div>
        </form>
      </div>
      <Divider flexItem variant="fullWidth" />
      <div className="manage-access__table--wrapper">
        <TableContainer component={Paper} className="branch-settings__table manage-access__table" style={{ marginTop: "20px" }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {collaborations?.map((collaborator: any) => (
                <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }} key={collaborator.id}>
                  <TableCell component="th" scope="row">
                    <Chip label={collaborator.user.username} variant="filled" />
                  </TableCell>
                  <TableCell style={{ padding: 0 }}>
                    <Select className="manage-access__select-role" value={collaborator.role} onChange={event => handleEdit(collaborator, event)}>
                      {accessLevels.map(level => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    <Delete sx={{ cursor: "pointer" }} onClick={() => deleteCollab({id: collaborator.user.id, repository: repo.id})}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="manage-access__button">
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Add Collaborator
        </Button>
      </div>

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

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} aria-labelledby="confirm-dialog">
        <DialogTitle id="confirm-dialog">Delete repository {repo.name}?</DialogTitle>
        <DialogContent>Are you sure you want to delete this this repository?</DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setDeleteOpen(false)} color="secondary">
            No
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setDeleteOpen(false);
              onConfirmDelete();
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageAccess;
