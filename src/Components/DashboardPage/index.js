import React, { useEffect, useState } from "react";
import UserHeader from "../../Layout/UserHeader";
import LoaderHelper from "../../Utils/Loading/LoaderHelper";
import AuthService from "../../Api/Api_Services/AuthService";
import { alertErrorMessage } from "../../Utils/CustomAlertMessage";
import DataTableBase from "../../Utils/DataTable";
import { useNavigate } from "react-router-dom";
import Loading from "../../Utils/Loading";

const statCards = [
  {
    key: "totalUser",
    label: "Total Users",
    valueKey: "totalUser",
    icon: "fa-users",
    gradient: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
    shadow: "0 10px 30px rgba(13,148,136,0.25)",
    path: "/dashboard/userList",
  },
  {
    key: "totalDispute",
    label: "Total Disputes",
    valueKey: "totalDispute",
    icon: "fa-gavel",
    gradient: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
    shadow: "0 10px 30px rgba(220,38,38,0.25)",
    path: "/dashboard/disputeResponse",
  },
  {
    key: "totalDepositInr",
    label: "Total Deposit (INR)",
    valueKey: "totalDepositInr",
    icon: "fa-arrow-down",
    gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    shadow: "0 10px 30px rgba(5,150,105,0.25)",
    path: "/dashboard/earn_depositWithdrawSummary",
    prefix: "₹",
    formatNumber: true,
  },
  {
    key: "totalWithdrawalInr",
    label: "Total Withdrawal (INR)",
    valueKey: "totalWithdrawalInr",
    icon: "fa-arrow-up",
    gradient: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
    shadow: "0 10px 30px rgba(8,145,178,0.25)",
    path: "/dashboard/withdrawalRequest",
    prefix: "₹",
    formatNumber: true,
  },
  {
    key: "totalRunninnGame",
    label: "Running Games",
    valueKey: "totalRunninnGame",
    icon: "fa-play-circle",
    gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    shadow: "0 10px 30px rgba(99,102,241,0.25)",
    path: "/dashboard/AllGamesList",
  },
  {
    key: "totalWaitingGame",
    label: "Open Battles",
    valueKey: "totalWaitingGame",
    icon: "fa-hourglass-half",
    gradient: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
    shadow: "0 10px 30px rgba(217,119,6,0.25)",
    path: "/dashboard/AllGamesList",
  },
  {
    key: "totalAdminCommission",
    label: "Admin Commission",
    valueKey: "totalAdminCommission",
    icon: "fa-percent",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
    shadow: "0 10px 30px rgba(124,58,237,0.25)",
    path: "/dashboard/AllGamesList",
    prefix: "₹",
    formatNumber: true,
  },
  {
    key: "totalUserCommission",
    label: "Commission Distributed",
    valueKey: "totalUserCommission",
    icon: "fa-hand-holding-usd",
    gradient: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
    shadow: "0 10px 30px rgba(22,163,74,0.25)",
    path: "/dashboard/commissionBonusList",
    prefix: "₹",
    formatNumber: true,
  },
];

function formatNum(num) {
  if (num == null || num === "") return "0";
  const n = Number(num);
  if (isNaN(n)) return String(num);
  if (n >= 1e7) return (n / 1e7).toFixed(1) + "Cr";
  if (n >= 1e5) return (n / 1e5).toFixed(1) + "L";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toLocaleString();
}

function DashboardPage() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({});
  const [dashboardList, setDashboardList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    handleDashboardData();
  }, []);

  const handleDashboardData = async () => {
    try {
      setLoading(true);
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.dashboardData();
      if (result?.success) {
        setDashboardData(result?.data || {});
        setDashboardList(result?.data?.activityLogs?.reverse() || []);
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      alertErrorMessage(error?.message);
    } finally {
      setLoading(false);
      LoaderHelper.loaderStatus(false);
    }
  };

  const columns = [
    {
      name: "Sr No",
      cell: (row, rowIndex) => rowIndex + 1 + (currentPage - 1) * rowsPerPage,
      width: "80px",
    },
    {
      name: "Activity",
      selector: (row) => row.Activity,
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <span className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px", background: "rgba(13,148,136,0.12)", color: "#0d9488" }}>
            <i className="fas fa-bolt fa-sm" />
          </span>
          <span className="fw-semibold">{row.Activity}</span>
        </div>
      ),
    },
    {
      name: "IP Address",
      selector: (row) => row.adminIP || "—",
      sortable: true,
      wrap: true,
    },
    {
      name: "Date & Time",
      selector: (row) => row.createdAt,
      sortable: true,
      cell: (row) => new Date(row.createdAt).toLocaleString(),
      wrap: true,
    },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <>
      <div className="dashboard_right">
        <UserHeader />
        <div className="dashboard_outer_s">
          {/* Page header */}
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
                  <p className="mb-1 text-white opacity-90" style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    {greeting()}
                  </p>
                  <h1 className="mb-0 text-white fw-bold" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>
                    Dashboard
                  </h1>
                  <p className="mb-0 text-white mt-1 opacity-75" style={{ fontSize: "0.85rem" }}>
                    Overview of your platform metrics and recent activity
                  </p>
                </div>
                <div
                  className="rounded-3 d-none d-md-flex align-items-center justify-content-center text-white"
                  style={{ width: "56px", height: "56px", background: "rgba(255,255,255,0.2)" }}
                >
                  <i className="fas fa-chart-line fa-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Stat cards grid */}
          <div
            className="row g-3 g-md-4 mb-4"
            style={{ marginLeft: 0, marginRight: 0 }}
          >
            {statCards.map((card) => {
              const value = dashboardData[card.valueKey];
              const displayValue = card.formatNumber ? formatNum(value) : (value ?? "0");
              const prefix = card.prefix || "";
              return (
                <div key={card.key} className="col-6 col-xl-3">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(card.path)}
                    onKeyDown={(e) => e.key === "Enter" && navigate(card.path)}
                    className="card border-0 rounded-4 h-100 overflow-hidden"
                    style={{
                      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = card.shadow;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
                    }}
                  >
                    <div className="card-body p-4">
                      <div className="d-flex align-items-start justify-content-between">
                        <div className="flex-grow-1 min-w-0">
                          <p className="text-muted mb-1 small" style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.03em" }}>
                            {card.label}
                          </p>
                          <p className="mb-0 fw-bold text-dark" style={{ fontSize: "1.35rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                            {prefix}{displayValue}
                          </p>
                        </div>
                        <div
                          className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: "48px",
                            height: "48px",
                            background: card.gradient,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            color: "#fff",
                          }}
                        >
                          <i className={`fas ${card.icon}`} style={{ fontSize: "1.1rem" }} />
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        height: "3px",
                        background: card.gradient,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity / Login table */}
          <div className="card border-0 rounded-4 overflow-hidden" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)", borderTop: "3px solid #6366f1" }}>
            <div
              className="card-header border-0 py-3 px-4"
              style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.08) 0%, transparent 100%)" }}
            >
              <h3 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                <span
                  className="rounded-3 d-inline-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff" }}
                >
                  <i className="fas fa-history" />
                </span>
                Login & Activity
              </h3>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div style={{ minHeight: 220, display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Loading />
                </div>
              ) : (
                <DataTableBase
                  columns={columns}
                  data={dashboardList}
                  pagination
                  paginationServer={false}
                  paginationPerPage={rowsPerPage}
                  paginationDefaultPage={currentPage}
                  onChangePage={(page) => setCurrentPage(page)}
                  onChangeRowsPerPage={(newPerPage, page) => {
                    setRowsPerPage(newPerPage);
                    setCurrentPage(page);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
