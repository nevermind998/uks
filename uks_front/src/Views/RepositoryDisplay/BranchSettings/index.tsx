import { Delete, Edit } from '@mui/icons-material';
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    Button,
    DialogActions,
    DialogContent,
    TextField,
    DialogTitle,
    Chip,
} from '@mui/material';
import { BranchDto } from '../../../Types/commit.types';
import { useState } from 'react';
import { useFormik } from 'formik';
import { useMutation, useQuery } from 'react-query';
import Toast, { ToastOptions } from '../../../Components/Common/Toast';
import { deleteBranch, renameBranch } from '../../../api/branches';
import { BRANCH_SCHEMA } from '../../Branch/branchValidationSchema';
import { getPullRequestsByRepo } from '../../../api/projectManagement';
import { PullRequestDto } from '../../../Types/pull_request.types';

const BranchSettings = ({ branches, repo, refetch }: any) => {
    const [editBranch, setEditBranch] = useState<BranchDto>();
    const [isOpen, setIsOpen] = useState(false);

    const [branchToDelete, setDeleteBranch] = useState<any>();
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [openToast, setOpenToast] = useState(false);
    const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: '', type: 'info' });

    const defaultBranch = branches.filter((b: any) => b.name === repo.default_branch)[0];

    const handleClickOpen = () => {
        setIsOpen(true);
    };
    const handleClose = () => {
        setIsOpen(false);
    };

    const { data: pullRequests } = useQuery({
        queryKey: ['PRS'],
        queryFn: async () => {
            const data: PullRequestDto[] = await getPullRequestsByRepo(repo.id);
            return data;
        },
    });

    const { mutate } = useMutation(renameBranch, {
        onSuccess: res => {
            setToastOptions({ message: 'Branch successfully created', type: 'success' });
            setOpenToast(true);
            handleClose();
            refetch();
        },
        onError: () => {
            setToastOptions({ message: 'A branch with this name already exists!', type: 'error' });
            setOpenToast(true);
        },
    });

    const { mutate: deleteSelectedBranch } = useMutation(deleteBranch, {
        onSuccess: res => {
            setToastOptions({ message: 'Branch successfully deleted', type: 'success' });
            setOpenToast(true);
            setDeleteOpen(false);
            refetch();
        },
        onError: () => {
            setToastOptions({ message: 'A branch could not be deleted!', type: 'error' });
            setOpenToast(true);
        },
    });

    const onConfirmDelete = () => {
        if (branchToDelete) deleteSelectedBranch(branchToDelete.id);
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            repository: 0,
        },
        validationSchema: BRANCH_SCHEMA,
        onSubmit: values => {
            const body = {
                id: editBranch?.id,
                name: values.name,
                repository: repo.id,
            };

            mutate(body);
        },
    });

    return (
        <div className="branch-settings">
            <Toast open={openToast} setOpen={setOpenToast} toastOptions={toastOptions} />
            <p>Repository branches</p>
            <TableContainer component={Paper} className="branch-settings__table">
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Default Branch</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                <Chip label={defaultBranch.name} variant="filled" />
                            </TableCell>
                            <TableCell component="th" scope="row" align="right">
                                <Edit
                                    onClick={() => {
                                        setEditBranch(defaultBranch);
                                        handleClickOpen();
                                    }}
                                    sx={{ cursor: 'pointer' }}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
            <br />
            <TableContainer component={Paper} className="branch-settings__table">
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {branches
                            .filter((b: any) => b.id !== defaultBranch.id)
                            .map((branch: BranchDto) => (
                                <TableRow key={branch.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        <Chip label={branch.name} variant="filled" />
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="right">
                                        <Edit
                                            onClick={() => {
                                                setEditBranch(branch);
                                                handleClickOpen();
                                            }}
                                            sx={{ cursor: 'pointer' }}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="right">
                                        <Delete
                                            onClick={() => {
                                                setDeleteBranch(branch);
                                                setDeleteOpen(true);
                                            }}
                                            sx={{ cursor: 'pointer' }}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="right">
                                        {pullRequests
                                            ?.filter((x: any) => x.compare_branch === branch.id)
                                            .map(pr => (
                                                <div key={pr.id} className="branch-settings__connected-pr">
                                                    <a href="/">#{pr.id}</a>
                                                    <Chip
                                                        label={pr.status}
                                                        variant="filled"
                                                        className={`branch-settings__${pr.status.toLowerCase()}`}
                                                    />
                                                </div>
                                            ))}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isOpen} onClose={handleClose}>
                <div className="modal-dialog-form__content-wrapper">
                    <h3>
                        Rename branch <i>{editBranch?.name}</i>
                    </h3>
                    <div className="modal-dialog-form__form">
                        <form onSubmit={formik.handleSubmit} className="modal-dialog-form__form">
                            <DialogContent>
                                <TextField
                                    id="name"
                                    variant="outlined"
                                    placeholder={editBranch?.name}
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    name="name"
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.errors.name && formik.touched.name}
                                    required
                                    className="modal-dialog-form__form--field"
                                    size="small"
                                />
                            </DialogContent>

                            <DialogActions>
                                <Button type="submit" className="add-update__button" variant="contained">
                                    Rename
                                </Button>
                            </DialogActions>
                        </form>
                    </div>
                </div>
            </Dialog>

            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} aria-labelledby="confirm-dialog">
                <DialogTitle id="confirm-dialog">Delete branch {branchToDelete?.name}?</DialogTitle>
                <DialogContent>Are you sure you want to delete this branch?</DialogContent>
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

export default BranchSettings;
