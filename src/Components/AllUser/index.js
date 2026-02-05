import React, { useEffect, useState } from "react";
import UserHeader from "../../Layout/UserHeader";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import AuthService from "../../Api/Api_Services/AuthService";
import moment from "moment";
import DataTableBase from "../../Utils/DataTable";
import { useNavigate } from "react-router-dom";
import { alertErrorMessage, alertSuccessMessage } from "../../Utils/CustomAlertMessage";

function AllUserList() {
  const [userList, setUserList] = useState([]);
  const [allData, setAllData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalData, setTotalData] = useState(0);

  useEffect(() => {
    handleUsersList(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handleUsersList = async (page, pageSize) => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.usersList(page, pageSize);
      if (result?.success) {
        setUserList(result?.data || []);
        setAllData(result?.data || []);
        setTotalData(result?.pagination?.totalUsers || 0);
        setCurrentPage(result?.pagination?.currentPage || page);
        setItemsPerPage(result?.pagination?.pageSize || pageSize);
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      alertErrorMessage(error?.message);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.updateAllUserStatus(id, status);
      if (result?.success) {
        alertSuccessMessage(result?.message || "Status updated successfully!");
        handleUsersList(currentPage, itemsPerPage);
      } else {
        alertErrorMessage(result?.message || "Failed to update status");
      }
    } catch (error) {
      alertErrorMessage(error?.message || "Something went wrong");
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  useEffect(() => {
    if (search) {
      const filteredData = allData?.filter(
        (item) =>
          item?.mobileNumber?.toLowerCase()?.includes(search?.toLowerCase()) ||
          item?.uuid?.includes(search)
      );
      setUserList(filteredData);
    } else {
      setUserList(allData);
    }
  }, [search, allData]);

  const navigate = useNavigate();

  const handleUserClick = (userId) => {
    navigate("/dashboard/UserDetails", { state: { userId } });
  };

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (currentPage - 1) * itemsPerPage + (index + 1),
      width: "80px",
    },
    {
      name: "Date & Time",
      selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"),
      sortable: true,
      wrap: true,
    },
    {
      name: "User Id",
      wrap: true,
      width: "160px",
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            onClick={() => handleUserClick(row?._id)}
            className="btn btn-link p-0 text-decoration-none fw-semibold"
            style={{ color: "#0d9488", cursor: "pointer" }}
          >
            {row?.uuid || "—"}
          </button>
          <button
            type="button"
            className="btn btn-link p-0 text-secondary"
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (row?.uuid) {
                navigator?.clipboard?.writeText(row?.uuid);
                alertSuccessMessage("UUID copied!");
              } else {
                alertErrorMessage("No UUID found");
              }
            }}
            title="Copy UUID"
          >
            <i className="far fa-copy" />
          </button>
        </div>
      ),
    },
    {
      name: "Name",
      selector: (row) => row?.name || "—",
      sortable: true,
      wrap: true,
    },
    {
      name: "Fista Username",
      selector: (row) => row?.fullName || "—",
      sortable: true,
      wrap: true,
    },
    {
      name: "Mobile",
      width: "140px",
      selector: (row) => row?.mobileNumber || "—",
      sortable: true,
      wrap: true,
    },
    {
      name: "KYC Status",
      selector: (row) => row?.kycVerified || "—",
      cell: (row) => {
        const kyc = row?.kycVerified;
        const isVerified = kyc === "APPROVED" || kyc === "VERIFIED";
        const isPending = kyc === "PENDING";
        return (
          <span
            className="badge rounded-pill border-0"
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              ...(isVerified && { background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff" }),
              ...(isPending && { background: "rgba(234,179,8,0.2)", color: "#a16207" }),
              ...(!isVerified && !isPending && { background: "#f1f5f9", color: "#64748b" }),
            }}
          >
            {kyc || "—"}
          </span>
        );
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "Rank",
      selector: (row) =>
        row?.rank
          ? row.rank.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
          : "—",
      sortable: true,
      wrap: true,
    },
    {
      name: "Referrals",
      selector: (row) => row?.totalRefer ?? 0,
      sortable: true,
      width: "100px",
    },
    {
      name: "Action",
      width: "140px",
      cell: (row) => {
        const status = row?.status || "INACTIVE";
        return (
          <div className="d-flex gap-2">
            {status === "ACTIVE" ? (
              <button
                type="button"
                className="btn btn-sm rounded-pill border-0 px-3"
                style={{ background: "#dc2626", color: "#fff", fontWeight: 600, fontSize: "0.75rem" }}
                onClick={() => handleStatusUpdate(row?._id, "INACTIVE")}
              >
                Inactive
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-sm rounded-pill border-0 px-3"
                style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)", color: "#fff", fontWeight: 600, fontSize: "0.75rem" }}
                onClick={() => handleStatusUpdate(row?._id, "ACTIVE")}
              >
                Active
              </button>
            )}
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
      <div className="dashboard_right">
        <UserHeader />
        <div className="dashboard_outer_s">
          {/* Page header - same theme as User Details & Dashboard */}
          <div className="mb-4">
            <div
              className="rounded-4 overflow-hidden border-0 p-4 p-md-5"
              style={{
                background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)",
                boxShadow: "0 16px 48px rgba(13,148,136,0.25)",
              }}
            >
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                <div>
                  <h1 className="mb-1 text-white fw-bold" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>
                    All User List
                  </h1>
                  <p className="mb-0 text-white opacity-75" style={{ fontSize: "0.9rem" }}>
                    Manage users, view details and update status
                  </p>
                </div>
                <div
                  className="rounded-3 d-none d-md-flex align-items-center justify-content-center text-white"
                  style={{ width: "56px", height: "56px", background: "rgba(255,255,255,0.2)" }}
                >
                  <i className="fas fa-users fa-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Table card - same theme */}
          <div
            className="card border-0 rounded-4 overflow-hidden"
            style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)", borderTop: "3px solid #0d9488" }}
          >
            <div
              className="card-header border-0 py-3 px-4"
              style={{ background: "linear-gradient(90deg, rgba(13,148,136,0.08) 0%, transparent 100%)" }}
            >
              <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
                <h3 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                  <span
                    className="rounded-3 d-inline-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #0d9488, #0f766e)", color: "#fff" }}
                  >
                    <i className="fas fa-list" />
                  </span>
                  User List
                </h3>
                <div className="d-flex align-items-center rounded-3 border overflow-hidden" style={{ background: "#f8fafc", maxWidth: "280px" }}>
                  <span className="px-3 py-2 text-muted">
                    <i className="fas fa-search" style={{ color: "#0d9488" }} />
                  </span>
                  <input
                    type="search"
                    className="form-control border-0 bg-transparent py-2"
                    placeholder="Search by mobile or UUID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ fontSize: "0.9rem" }}
                  />
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="userlisttable">
                <DataTableBase columns={columns} data={userList} pagination />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AllUserList;
