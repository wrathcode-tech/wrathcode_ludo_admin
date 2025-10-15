import React, { useState } from 'react';
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';

function Settings() {
    const [settings, setSettings] = useState({
        minimumDeposit: '',
        maximumDeposit: '',
        minimumWithdrawal: '',
        maximumWithdrawal: '',
        adminCommission: '',
        referralBonusAmount: '',
        userCommissionBonusAmount: '',
        referralBonusSignUpAmount: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSettings = async (e) => {
        e.preventDefault(); // stops page reload

        const {
            adminCommission, referralBonusAmount, userCommissionBonusAmount, referralBonusSignUpAmount,
            minimumDeposit, maximumDeposit, minimumWithdrawal, maximumWithdrawal, bonusAmountUse, minimumGameAmount, maximumGameAmount,
            bonusUsedPercent, minimumDepositUsdt, minimumWithdrawalUsdt, maximumDepositUsdt, maximumWithdrawalUsdt
        } = settings;

        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.updateAdminSettings(
                adminCommission, referralBonusAmount, userCommissionBonusAmount, referralBonusSignUpAmount,
                minimumDeposit, maximumDeposit, minimumWithdrawal, maximumWithdrawal, bonusAmountUse, minimumGameAmount, maximumGameAmount,
                bonusUsedPercent, minimumDepositUsdt, minimumWithdrawalUsdt, maximumDepositUsdt, maximumWithdrawalUsdt
            );

            if (result?.success) {
                alertSuccessMessage(result.message);
            } else {
                alertErrorMessage(result?.message || "Something went wrong");
            }
        } catch (error) {
            alertErrorMessage(error?.message || "Error occurred");
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };




    return (
        <div className='dashboard_right'>
            <div className='setting_form'>
                <h2>Admin Settings</h2>

                <form onSubmit={handleUpdateSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Row 1 - Deposit INR */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Minimum Deposit (INR)</label>
                            <input
                                className='form-control'
                                type="number"
                                name="minimumDeposit"
                                placeholder="Minimum Deposit (INR)"
                                value={settings.minimumDeposit}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Maximum Deposit (INR)</label>
                            <input
                                className='form-control'
                                type="number"
                                name="maximumDeposit"
                                placeholder="Maximum Deposit (INR)"
                                value={settings.maximumDeposit}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Row 2 - Withdrawal INR */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Minimum Withdrawal (INR)</label>
                            <input
                                className='form-control'
                                type="number"
                                name="minimumWithdrawal"
                                placeholder="Minimum Withdrawal (INR)"
                                value={settings.minimumWithdrawal}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Maximum Withdrawal (INR)</label>
                            <input
                                className='form-control'
                                type="number"
                                name="maximumWithdrawal"
                                placeholder="Maximum Withdrawal (INR)"
                                value={settings.maximumWithdrawal}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Row 3 - USDT Deposit/Withdrawal */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Minimum Deposit (USDT)</label>
                            <input
                                className='form-control'
                                type="number"
                                name="minimumDepositUsdt"
                                placeholder="Minimum Deposit (USDT)"
                                value={settings.minimumDepositUsdt}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Maximum Deposit (USDT)</label>
                            <input
                                className='form-control'
                                type="number"
                                name="maximumDepositUsdt"
                                placeholder="Maximum Deposit (USDT)"
                                value={settings.maximumDepositUsdt}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Row 4 - USDT Withdrawals */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Minimum Withdrawal (USDT)</label>
                            <input
                                className='form-control'
                                type="number"
                                name="minimumWithdrawalUsdt"
                                placeholder="Minimum Withdrawal (USDT)"
                                value={settings.minimumWithdrawalUsdt}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Maximum Withdrawal (USDT)</label>
                            <input
                                className='form-control'
                                type="number"
                                name="maximumWithdrawalUsdt"
                                placeholder="Maximum Withdrawal (USDT)"
                                value={settings.maximumWithdrawalUsdt}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Row 5 - Commissions & Bonuses */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Admin Commission (%)</label>
                            <input
                                className='form-control'
                                type="number"
                                name="adminCommission"
                                placeholder="Admin Commission (%)"
                                value={settings.adminCommission}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>User Commission Bonus Amount</label>
                            <input
                                className='form-control'
                                type="number"
                                name="userCommissionBonusAmount"
                                placeholder="User Commission Bonus"
                                value={settings.userCommissionBonusAmount}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Row 6 - Referral Bonuses */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Referral Bonus (After Deposit)</label>
                            <input
                                className='form-control'
                                type="number"
                                name="referralBonusAmount"
                                placeholder="Referral Bonus After Deposit"
                                value={settings.referralBonusAmount}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Referral Bonus (SignUp)</label>
                            <input
                                className='form-control'
                                type="number"
                                name="referralBonusSignUpAmount"
                                placeholder="Referral Bonus on SignUp"
                                value={settings.referralBonusSignUpAmount}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Row 7 - Game Limits */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Minimum Game Amount</label>
                            <input
                                className='form-control'
                                type="number"
                                name="minimumGameAmount"
                                placeholder="Minimum Game Amount"
                                value={settings.minimumGameAmount}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Maximum Game Amount</label>
                            <input
                                className='form-control'
                                type="number"
                                name="maximumGameAmount"
                                placeholder="Maximum Game Amount"
                                value={settings.maximumGameAmount}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Row 8 - Bonus Usage */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Bonus Amount Use (₹)</label>
                            <input
                                className='form-control'
                                type="number"
                                name="bonusAmountUse"
                                placeholder="Bonus Amount Use"
                                value={settings.bonusAmountUse}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Bonus Used Percent (%)</label>
                            <input
                                className='form-control'
                                type="number"
                                name="bonusUsedPercent"
                                placeholder="Bonus Used Percent"
                                value={settings.bonusUsedPercent}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        style={{
                            padding: '10px',
                            backgroundColor: '#03c2c7',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            marginTop: '10px'
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
