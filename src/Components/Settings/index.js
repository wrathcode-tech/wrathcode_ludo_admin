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
            adminCommission,
            referralBonusAmount,
            userCommissionBonusAmount,
            referralBonusSignUpAmount,
            minimumDeposit,
            maximumDeposit,
            minimumWithdrawal,
            maximumWithdrawal
        } = settings;

        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.updateAdminSettings(
                adminCommission,
                referralBonusAmount,
                userCommissionBonusAmount,
                referralBonusSignUpAmount,
                minimumDeposit,
                maximumDeposit,
                minimumWithdrawal,
                maximumWithdrawal
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
                    {/* Row 1 */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Minimum Deposit</label>
                            <input className='form-control'
                                type="number"
                                name="minimumDeposit"
                                placeholder="Minimum Deposit"
                                value={settings.minimumDeposit}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Maximum Deposit</label>
                            <input className='form-control'
                                type="number"
                                name="maximumDeposit"
                                placeholder="Maximum Deposit"
                                value={settings.maximumDeposit}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Minimum Withdrawal</label>
                            <input className='form-control'
                                type="number"
                                name="minimumWithdrawal"
                                placeholder="Minimum Withdrawal"
                                value={settings.minimumWithdrawal}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Maximum Withdrawal</label>
                            <input className='form-control'
                                type="number"
                                name="maximumWithdrawal"
                                placeholder="Maximum Withdrawal"
                                value={settings.maximumWithdrawal}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Admin Commission (%)</label>
                            <input className='form-control'
                                type="number"
                                name="adminCommission"
                                placeholder="Admin Commission"
                                value={settings.adminCommission}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Referral Bonus Amount</label>
                            <input className='form-control'
                                type="number"
                                name="referralBonusAmount"
                                placeholder="Referral Bonus"
                                value={settings.referralBonusAmount}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Row 4 */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>User Commission Bonus Amount</label>
                            <input className='form-control'
                                type="number"
                                name="userCommissionBonusAmount"
                                placeholder="User Commission Bonus"
                                value={settings.userCommissionBonusAmount}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label>Referral Bonus SignUp Amount</label>
                            <input className='form-control'
                                type="number"
                                name="referralBonusSignUpAmount"
                                placeholder="Referral SignUp Bonus"
                                value={settings.referralBonusSignUpAmount}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

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
