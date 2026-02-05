import React, { useEffect, useState } from 'react';
import UserHeader from '../../Layout/UserHeader';
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';

const TEAL_BTN = "linear-gradient(135deg, #0d9488, #0f766e)";

function Settings() {
    const [settingsData, setSettingsData] = useState({
        minimumDeposit: "",
        maximumDeposit: "",
        minimumWithdrawal: "",
        maximumWithdrawal: "",
        minimumDepositUsdt: "",
        maximumDepositUsdt: "",
        minimumWithdrawalUsdt: "",
        maximumWithdrawalUsdt: "",
        adminCommission: "",
        userCommissionBonusAmount: "",
        refferalBonusAmount: "",
        refferalBonusAmountSignUp: "",
        minimumGameAmount: "",
        maximumGameAmount: "",
        minimumGameAmountUsdt: "",
        maximumGameAmountUsdt: "",
        bonusAmountUse: "",
        bonusUsedPercent: "",
        matchCancelTimerInSec: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettingsData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSettings = async (adminCommission, referralBonusAmount, userCommissionBonusAmount, referralBonusSignUpAmount,
        minimumDeposit, maximumDeposit, minimumWithdrawal, maximumWithdrawal, bonusAmountUse, minimumGameAmount, maximumGameAmount,
        bonusUsedPercent, minimumDepositUsdt, minimumWithdrawalUsdt, maximumDepositUsdt, maximumWithdrawalUsdt, minimumGameAmountUsdt, maximumGameAmountUsdt) => {

        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.updateAdminSettings(adminCommission, referralBonusAmount, userCommissionBonusAmount, referralBonusSignUpAmount,
                minimumDeposit, maximumDeposit, minimumWithdrawal, maximumWithdrawal, bonusAmountUse, minimumGameAmount, maximumGameAmount,
                bonusUsedPercent, minimumDepositUsdt, minimumWithdrawalUsdt, maximumDepositUsdt, maximumWithdrawalUsdt, minimumGameAmountUsdt, maximumGameAmountUsdt);
            if (result?.success) {
                alertSuccessMessage(result?.message || "Settings updated successfully!");
                handleSettingData();
            } else {
                alertErrorMessage(result?.message || "Failed to update settings");
            }
        } catch (error) {
            alertErrorMessage(error?.message || "Error updating settings");
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    const handleSettingData = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.adminSettingData();
            if (result?.success) {
                setSettingsData(result?.data || {});
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    useEffect(() => {
        handleSettingData();
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        handleUpdateSettings(
            settingsData.adminCommission,
            settingsData.refferalBonusAmount,
            settingsData.userCommissionBonusAmount,
            settingsData.refferalBonusAmountSignUp,
            settingsData.minimumDeposit,
            settingsData.maximumDeposit,
            settingsData.minimumWithdrawal,
            settingsData.maximumWithdrawal,
            settingsData.bonusAmountUse,
            settingsData.minimumGameAmount,
            settingsData.maximumGameAmount,
            settingsData.bonusUsedPercent,
            settingsData.minimumDepositUsdt,
            settingsData.minimumWithdrawalUsdt,
            settingsData.maximumDepositUsdt,
            settingsData.maximumWithdrawalUsdt,
            settingsData.minimumGameAmountUsdt,
            settingsData.maximumGameAmountUsdt
        );
    };

    return (
        <div className="dashboard_right">
            <UserHeader />
            <div className="dashboard_outer_s">
                <div className="mb-4">
                    <div className="rounded-4 overflow-hidden border-0 p-4 p-md-5" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)", boxShadow: "0 16px 48px rgba(13,148,136,0.25)" }}>
                        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                            <div>
                                <h1 className="mb-1 text-white fw-bold" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>Admin Settings</h1>
                                <p className="mb-0 text-white opacity-75" style={{ fontSize: "0.9rem" }}>Configure limits, commissions and bonuses</p>
                            </div>
                            <div className="rounded-3 d-none d-md-flex align-items-center justify-content-center text-white" style={{ width: "56px", height: "56px", background: "rgba(255,255,255,0.2)" }}><i className="fas fa-cog fa-lg" /></div>
                        </div>
                    </div>
                </div>
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ borderLeft: "4px solid #0d9488" }}>
                    <div className="card-body p-4">
                <form onSubmit={onSubmit}>
                    {/* Row 1 - Deposit INR */}
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">Minimum Deposit (INR)</label>
                            <input type="number" name="minimumDeposit" className="form-control rounded-3" value={settingsData.minimumDeposit} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">Maximum Deposit (INR)</label>
                            <input type="number" name="maximumDeposit" className="form-control rounded-3" value={settingsData.maximumDeposit} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Row 2 - Withdrawal INR */}
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">Minimum Withdrawal (INR)</label>
                            <input type="number" name="minimumWithdrawal" className="form-control rounded-3" value={settingsData.minimumWithdrawal} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">Maximum Withdrawal (INR)</label>
                            <input type="number" name="maximumWithdrawal" className="form-control rounded-3" value={settingsData.maximumWithdrawal} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Row 3 - Deposit USDT */}
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">Minimum Deposit (USDT)</label>
                            <input type="number" name="minimumDepositUsdt" className="form-control rounded-3" value={settingsData.minimumDepositUsdt} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">Maximum Deposit (USDT)</label>
                            <input type="number" name="maximumDepositUsdt" className="form-control rounded-3" value={settingsData.maximumDepositUsdt} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Row 4 - Withdrawal USDT */}
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">Minimum Withdrawal (USDT)</label>
                            <input type="number" name="minimumWithdrawalUsdt" className="form-control rounded-3" value={settingsData.minimumWithdrawalUsdt} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">Maximum Withdrawal (USDT)</label>
                            <input type="number" name="maximumWithdrawalUsdt" className="form-control rounded-3" value={settingsData.maximumWithdrawalUsdt} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Row 5 - Commissions */}
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">Admin Commission (%)</label>
                            <input type="number" name="adminCommission" className="form-control rounded-3" value={settingsData.adminCommission} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">User Commission Bonus Amount</label>
                            <input type="number" name="userCommissionBonusAmount" className="form-control rounded-3" value={settingsData.userCommissionBonusAmount} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Row 6 - Referral Bonuses */}
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">Referral Bonus (After Deposit)</label>
                            <input type="number" name="refferalBonusAmount" className="form-control rounded-3" value={settingsData.refferalBonusAmount} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">Referral Bonus (SignUp)</label>
                            <input type="number" name="refferalBonusAmountSignUp" className="form-control rounded-3" value={settingsData.refferalBonusAmountSignUp} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Row 7 - Game Amounts */}
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">Minimum Game Amount</label>
                            <input type="number" name="minimumGameAmount" className="form-control rounded-3" value={settingsData.minimumGameAmount} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">Maximum Game Amount</label>
                            <input type="number" name="maximumGameAmount" className="form-control rounded-3" value={settingsData.maximumGameAmount} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Row 8 - Bonus Usage */}
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">Bonus Amount Use (₹)</label>
                            <input type="number" name="bonusAmountUse" className="form-control rounded-3" value={settingsData.bonusAmountUse} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">Bonus Used Percent (%)</label>
                            <input type="number" name="bonusUsedPercent" className="form-control rounded-3" value={settingsData.bonusUsedPercent} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Row 9 & 10 - Game Amount USDT */}
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">Minimum Game Amount USDT</label>
                            <input type="number" name="minimumGameAmountUsdt" className="form-control rounded-3" value={settingsData.minimumGameAmountUsdt} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold small text-secondary">Maximum Game Amount USDT</label>
                            <input type="number" name="maximumGameAmountUsdt" className="form-control rounded-3" value={settingsData.maximumGameAmountUsdt} onChange={handleChange} />
                        </div>
                    </div>

                    <button type="submit" className="btn mt-3 rounded-pill border-0 px-4 py-2 text-white fw-semibold" style={{ background: TEAL_BTN }}>Save Settings</button>
                </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
