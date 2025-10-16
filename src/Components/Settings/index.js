import React, { useEffect, useState } from 'react';
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';

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

    return (
        <div className='dashboard_right'>
            <div className="setting_form">
                <h2>Admin Settings</h2>
                <form onSubmit={handleUpdateSettings}>
                    {/* Row 1 - Deposit INR */}
                    <div className="admin_setting_form">
                        <div className="form_setting_in">
                            <label>Minimum Deposit (INR)</label>
                            <input type="number" name="minimumDeposit" className="form-control" value={settingsData.minimumDeposit} onChange={handleChange} />
                        </div>
                        <div className="form_setting_in">
                            <label>Maximum Deposit (INR)</label>
                            <input type="number" name="maximumDeposit" className="form-control" value={settingsData.maximumDeposit} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Row 2 - Withdrawal INR */}
                    <div className="admin_setting_form">
                        <div className="form_setting_in">
                            <label>Minimum Withdrawal (INR)</label>
                            <input type="number" name="minimumWithdrawal" className="form-control" value={settingsData.minimumWithdrawal} onChange={handleChange} />
                        </div>
                        <div className="form_setting_in">
                            <label>Maximum Withdrawal (INR)</label>
                            <input type="number" name="maximumWithdrawal" className="form-control" value={settingsData.maximumWithdrawal} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Row 3 - Deposit USDT */}
                    <div className="admin_setting_form">
                        <div className="form_setting_in">
                            <label>Minimum Deposit (USDT)</label>
                            <input type="number" name="minimumDepositUsdt" className="form-control" value={settingsData.minimumDepositUsdt} onChange={handleChange} />
                        </div>
                        <div className="form_setting_in">
                            <label>Maximum Deposit (USDT)</label>
                            <input type="number" name="maximumDepositUsdt" className="form-control" value={settingsData.maximumDepositUsdt} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Row 4 - Withdrawal USDT */}
                    <div className="admin_setting_form">
                        <div className="form_setting_in">
                            <label>Minimum Withdrawal (USDT)</label>
                            <input type="number" name="minimumWithdrawalUsdt" className="form-control" value={settingsData.minimumWithdrawalUsdt} onChange={handleChange} />
                        </div>
                        <div className="form_setting_in">
                            <label>Maximum Withdrawal (USDT)</label>
                            <input type="number" name="maximumWithdrawalUsdt" className="form-control" value={settingsData.maximumWithdrawalUsdt} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Row 5 - Commissions */}
                    <div className="admin_setting_form">
                        <div className="form_setting_in">
                            <label>Admin Commission (%)</label>
                            <input type="number" name="adminCommission" className="form-control" value={settingsData.adminCommission} onChange={handleChange} />
                        </div>
                        <div className="form_setting_in">
                            <label>User Commission Bonus Amount</label>
                            <input type="number" name="userCommissionBonusAmount" className="form-control" value={settingsData.userCommissionBonusAmount} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Row 6 - Referral Bonuses */}
                    <div className="admin_setting_form">
                        <div className="form_setting_in">
                            <label>Referral Bonus (After Deposit)</label>
                            <input type="number" name="refferalBonusAmount" className="form-control" value={settingsData.refferalBonusAmount} onChange={handleChange} />
                        </div>
                        <div className="form_setting_in">
                            <label>Referral Bonus (SignUp)</label>
                            <input type="number" name="refferalBonusAmountSignUp" className="form-control" value={settingsData.refferalBonusAmountSignUp} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Row 7 - Game Amounts */}
                    <div className="admin_setting_form">
                        <div className="form_setting_in">
                            <label>Minimum Game Amount</label>
                            <input type="number" name="minimumGameAmount" className="form-control" value={settingsData.minimumGameAmount} onChange={handleChange} />
                        </div>
                        <div className="form_setting_in">
                            <label>Maximum Game Amount</label>
                            <input type="number" name="maximumGameAmount" className="form-control" value={settingsData.maximumGameAmount} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Row 8 - Bonus Usage */}
                    <div className="admin_setting_form">
                        <div className="form_setting_in">
                            <label>Bonus Amount Use (₹)</label>
                            <input type="number" name="bonusAmountUse" className="form-control" value={settingsData.bonusAmountUse} onChange={handleChange} />
                        </div>
                        <div className="form_setting_in">
                            <label>Bonus Used Percent (%)</label>
                            <input type="number" name="bonusUsedPercent" className="form-control" value={settingsData.bonusUsedPercent} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Row 9 - Minimum Game Amount USDT*/}
                    <div className="admin_setting_form">
                        <div className="form_setting_in">
                            <label>Minimum Game Amount USDT</label>
                            <input type="number" name="minimumGameAmountUsdt" className="form-control" value={settingsData?.minimumGameAmountUsdt} onChange={handleChange} />
                        </div>
                    </div>
                    {/* Row 10 - Maximum Game Amount USDT*/}
                    <div className="admin_setting_form">
                        <div className="form_setting_in">
                            <label>Maximum Game Amount USDT</label>
                            <input type="number" name="maximumGameAmountUsdt" className="form-control" value={settingsData?.maximumGameAmountUsdt} onChange={handleChange} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: "10px",
                            backgroundColor: "#03c2c7",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            marginTop: "10px",
                        }}
                    >
                        Save Settings
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Settings;
