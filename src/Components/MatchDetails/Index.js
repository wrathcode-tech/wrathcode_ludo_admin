import React, { useEffect, useState } from "react";
import UserHeader from "../../Layout/UserHeader";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import AuthService from "../../Api/Api_Services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../Utils/CustomAlertMessage";
import moment from "moment";
import DataTableBase from "../../Utils/DataTable";
import { useNavigate } from "react-router-dom";

const TEAL_ACCENT = "#0d9488";

function MatchDetails() {
  const [allData, setAllData] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        LoaderHelper.loaderStatus(true);
        const result = await AuthService.getUsersRespose();
        if (result?.success) {
          const data = result?.data || [];
          setAllData(data);
          setResponseData(data);
        } else {
          alertErrorMessage(result?.message);
        }
      } catch (error) {
        alertErrorMessage(error?.message);
      } finally {
        LoaderHelper.loaderStatus(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setResponseData(allData);
      return;
    }
    const term = search.toLowerCase();
    const keys = ["userId.fullName", "userId.uuid", "eventId", "utrNumber", "amount", "matchAmount"];
    const filtered = allData.filter((obj) =>
      keys.some((key) => {
        const value = key.split(".").reduce((acc, k) => acc?.[k], obj);
        return value?.toString()?.toLowerCase()?.includes(term);
      })
    );
    setResponseData(filtered);
  }, [search, allData]);

  const handleUserClick = (userId) => {
    navigate("/dashboard/UserDetails", { state: { userId } });
  };

  const columns = [
    { name: "Date & Time", selector: (row) => moment(row.createdAt).format("DD-MM-YYYY LT"), sortable: true, wrap: true },
    {
      name: "User Id",
      width: "160px",
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <button type="button" onClick={() => handleUserClick(row?.userId?._id)} className="btn btn-link p-0 text-decoration-none fw-semibold" style={{ color: TEAL_ACCENT, cursor: "pointer" }}>{row?.userId?.uuid || "—"}</button>
          <button type="button" className="btn btn-link p-0 text-secondary" style={{ cursor: "pointer" }} onClick={() => { const u = row?.userId?.uuid; if (u) { navigator?.clipboard?.writeText(u); alertSuccessMessage("UUID copied!"); } else alertErrorMessage("No UUID found"); }} title="Copy"><i className="far fa-copy" /></button>
        </div>
      ),
    },
    { name: "Event ID", selector: (row) => row?.eventId ?? "—", sortable: true, wrap: true },
    { name: "Match Amount", selector: (row) => `₹ ${row?.matchAmount ?? 0}`, sortable: true, wrap: true },
    { name: "Status", width: "100px", cell: (row) => <span className="badge rounded-pill border-0" style={{ fontSize: "0.7rem", fontWeight: 600, background: "#0d9488", color: "#fff" }}>{row?.status ?? "—"}</span>, sortable: true },
  ];

  return (
    <div className="dashboard_right">
      <UserHeader />
      <div className="dashboard_outer_s">
        <div className="mb-4">
          <div className="rounded-4 overflow-hidden border-0 p-4 p-md-5" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)", boxShadow: "0 16px 48px rgba(13,148,136,0.25)" }}>
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
              <div>
                <h1 className="mb-1 text-white fw-bold" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>After Match User Response List</h1>
                <p className="mb-0 text-white opacity-75" style={{ fontSize: "0.9rem" }}>User responses after match completion</p>
              </div>
              <div className="rounded-3 d-none d-md-flex align-items-center justify-content-center text-white" style={{ width: "56px", height: "56px", background: "rgba(255,255,255,0.2)" }}><i className="fas fa-trophy fa-lg" /></div>
            </div>
          </div>
        </div>
        <div className="card border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)", borderTop: "3px solid #0d9488" }}>
          <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(90deg, rgba(13,148,136,0.08) 0%, transparent 100%)" }}>
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
              <h3 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                <span className="rounded-3 d-inline-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #0d9488, #0f766e)", color: "#fff" }}><i className="fas fa-list" /></span>
                User Responses
              </h3>
              <div className="d-flex align-items-center rounded-3 border overflow-hidden" style={{ background: "#f8fafc", maxWidth: "280px" }}>
                <span className="px-3 py-2 text-muted"><i className="fas fa-search" style={{ color: TEAL_ACCENT }} /></span>
                <input type="search" className="form-control border-0 bg-transparent py-2" placeholder="Search by name, UUID, event, amount..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ fontSize: "0.9rem" }} />
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <DataTableBase columns={columns} data={responseData} pagination />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchDetails;
