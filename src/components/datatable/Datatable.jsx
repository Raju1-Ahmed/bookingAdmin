import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import Loading from "../loading/Loading";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { userColumns } from "../../datatablesource";

const Datatable = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const { data, loading: fetchDataLoading, error } = useFetch(`http://localhost:8800/api/${path}`);

  useEffect(() => {
    if (data && data.length > 0) {
      setList(data);
    }
  }, [data]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8800/api/${path}/${deleteItemId}`);
      setList(list.filter((item) => item._id !== deleteItemId));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setDeleteItemId(null);
      setShowConfirmation(false);
    }
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteItemId(id);
    setShowConfirmation(true);
  };

  const handleCancelConfirmation = () => {
    setDeleteItemId(null);
    setShowConfirmation(false);
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        const itemId = params.row._id;
        return (
          <div className="cellAction">
            <Link to={`/users/${itemId}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div className="deleteButton" onClick={() => handleDeleteConfirmation(itemId)}>
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  if (fetchDataLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New User
        <Link to="/users/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={list}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
      />

      <Dialog open={showConfirmation} onClose={handleCancelConfirmation}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirmation}>Cancel</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {loading && <Loading />}
    </div>
  );
};

export default Datatable;
