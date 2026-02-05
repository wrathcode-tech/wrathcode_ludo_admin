import React, { useEffect, useState } from "react";
import UserHeader from "../../Layout/UserHeader";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import { alertErrorMessage, alertSuccessMessage } from "../../Utils/CustomAlertMessage";
import AuthService from "../../Api/Api_Services/AuthService";
import DataTableBase from "../../Utils/DataTable";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const TEAL_GRADIENT = "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)";
const TEAL_ACCENT = "#0d9488";

function CommissionBonusList() {
  const [userList, setUserList] = useState([]);
  const [allData, setAllData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchList = async (page, pageSize) => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.usersOverAllCommissionBonusEarn({ page, pageSize });
      if (result?.success) {
        const data = result.data || [];
        setAllData(data);
        setUserList(data);
      } else alertErrorMessage(result?.message);
    } catch (error) {
      alertErrorMessage(error?.message);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  useEffect(() => {
    fetchList(currentPage, perPage);
  }, [currentPage, perPage]);

  useEffect(() => {
    if (!search.trim()) {
      setUserList(allData);
      return;
    }
    const v = search.toLowerCase();
    const filtered = allData.filter((item) => (item?.emailId || "").toLowerCase().includes(v) || String(item?.userId ?? item?.uuid ?? "").includes(search) || (item?.mobileNumber || "").includes(search));
    setUserList(filtered);
  }, [search, allData]);

  const handleUserClick = (userId) => {
    navigate("/dashboard/UserDetails", { state: { userId } });
  };

  const columns = [
    { name: "S.No", width: "80px", selector: (row, index) => index + 1 + (currentPage - 1) * perPage },
    { name: "Date & Time", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true },
    {
      name: "User Id",
      width: "160px",
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <button type="button" onClick={() => handleUserClick(row?._id)} className="btn btn-link p-0 text-decoration-none fw-semibold" style={{ color: TEAL_ACCENT, cursor: "pointer" }}>{row?.uuid || "—"}</button>
          <button type="button" className="btn btn-link p-0 text-secondary" style={{ cursor: "pointer" }} onClick={() => { if (row?.uuid) { navigator?.clipboard?.writeText(row.uuid); alertSuccessMessage("UUID copied!"); } else alertErrorMessage("No UUID found"); }} title="Copy"><i className="far fa-copy" /></button>
        </div>
      ),
    },
    { name: "Full Name", selector: (row) => row?.fullName ?? "—", sortable: true, wrap: true },
    { name: "Mobile", selector: (row) => row?.mobileNumber ?? "—", sortable: true, wrap: true, width: "140px" },
    { name: "Total Credits", selector: (row) => `₹ ${row?.totalCredit ?? 0}`, sortable: true, wrap: true },
    { name: "Total Debits", selector: (row) => `₹ ${row?.totalDebit ?? 0}`, sortable: true, wrap: true },
  ];

  return (
    <div className="dashboard_right">
      <UserHeader />
      <div className="dashboard_outer_s">
        <div className="mb-4">
          <div className="rounded-4 overflow-hidden border-0 p-4 p-md-5" style={{ background: TEAL_GRADIENT, boxShadow: "0 16px 48px rgba(13,148,136,0.25)" }}>
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
              <div>
                <h1 className="mb-1 text-white fw-bold" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>All Commission Bonus List</h1>
                <p className="mb-0 text-white opacity-75" style={{ fontSize: "0.9rem" }}>Commission bonus credits and debits by user</p>
              </div>
              <div className="rounded-3 d-none d-md-flex align-items-center justify-content-center text-white" style={{ width: "56px", height: "56px", background: "rgba(255,255,255,0.2)" }}><i className="fas fa-percent fa-lg" /></div>
            </div>
          </div>
        </div>
        <div className="card border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)", borderTop: "3px solid #16a34a" }}>
          <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(90deg, rgba(22,163,74,0.08) 0%, transparent 100%)" }}>
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
              <h3 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                <span className="rounded-3 d-inline-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #16a34a, #15803d)", color: "#fff" }}><i className="fas fa-list" /></span>
                Commission Bonus
              </h3>
              <div className="d-flex align-items-center rounded-3 border overflow-hidden" style={{ background: "#f8fafc", maxWidth: "280px" }}>
                <span className="px-3 py-2 text-muted"><i className="fas fa-search" style={{ color: TEAL_ACCENT }} /></span>
                <input type="search" className="form-control border-0 bg-transparent py-2" placeholder="Search by email, UUID, mobile..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ fontSize: "0.9rem" }} />
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <DataTableBase columns={columns} data={userList} pagination />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommissionBonusList;
