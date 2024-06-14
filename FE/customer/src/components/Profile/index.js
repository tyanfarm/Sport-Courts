import React from 'react'

const Profile = () => {
    return (
        <div>
            <main className="profile-content">
                <div className="account-page-area section-space-y-axis-100">
                    <div className="profile-container">
                        <div className="row">
                            <div className="col-lg-3">
                                <ul className="nav myaccount-tab-trigger" id="account-page-tab" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active" id="account-dashboard-tab" data-bs-toggle="tab" href="#account-dashboard" role="tab" aria-controls="account-dashboard" aria-selected="true">Dashboard</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="account-orders-tab" data-bs-toggle="tab" href="#account-orders" role="tab" aria-controls="account-orders" aria-selected="false">Orders</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="account-address-tab" data-bs-toggle="tab" href="#account-address" role="tab" aria-controls="account-address" aria-selected="false">Addresses</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="account-details-tab" data-bs-toggle="tab" href="#account-details" role="tab" aria-controls="account-details" aria-selected="false">Account Details</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="account-logout-tab" href="login-register.html" role="tab" aria-selected="false">Logout</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-lg-9">
                                <div className="tab-content myaccount-tab-content" id="account-page-tab-content">
                                    <div className="tab-pane fade show active" id="account-dashboard" role="tabpanel" aria-labelledby="account-dashboard-tab">
                                        <div className="myaccount-dashboard">
                                            <p>Hello <b>Harmic</b> (not Harmic? <a href="login-register.html">Sign
                                                out</a>)</p>
                                            <p>From your account dashboard you can view your recent orders, manage your shipping and
                                                billing addresses and <a href="javascript:void(0)">edit your password and account details</a>.</p>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="account-orders" role="tabpanel" aria-labelledby="account-orders-tab">
                                        <div className="myaccount-orders">
                                            <h4 className="small-title">MY ORDERS</h4>
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-hover">
                                                    <tbody>
                                                        <tr>
                                                            <th>ORDER</th>
                                                            <th>DATE</th>
                                                            <th>STATUS</th>
                                                            <th>TOTAL</th>
                                                            <th></th>
                                                        </tr>
                                                        <tr>
                                                            <td><a className="account-order-id" href="javascript:void(0)">#5364</a></td>
                                                            <td>Mar 27, 2019</td>
                                                            <td>On Hold</td>
                                                            <td>$162.00 for 2 items</td>
                                                            <td><a href="javascript:void(0)" className="btn btn-secondary btn-primary-hover"><span>View</span></a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><a className="account-order-id" href="javascript:void(0)">#5356</a></td>
                                                            <td>Mar 27, 2019</td>
                                                            <td>On Hold</td>
                                                            <td>$162.00 for 2 items</td>
                                                            <td><a href="javascript:void(0)" className="btn btn-secondary btn-primary-hover"><span>View</span></a>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="account-address" role="tabpanel" aria-labelledby="account-address-tab">
                                        <div className="myaccount-address">
                                            <p>The following addresses will be used on the checkout page by default.</p>
                                            <div className="row">
                                                <div className="col">
                                                    <h4 className="small-title">BILLING ADDRESS</h4>
                                                    <address>
                                                        1234 Heaven Stress, Beverly Hill OldYork UnitedState of Lorem
                                                    </address>
                                                </div>
                                                <div className="col">
                                                    <h4 className="small-title">SHIPPING ADDRESS</h4>
                                                    <address>
                                                        1234 Heaven Stress, Beverly Hill OldYork UnitedState of Lorem
                                                    </address>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="account-details" role="tabpanel" aria-labelledby="account-details-tab">
                                        <div className="myaccount-details">
                                            <form action="#" className="myaccount-form">
                                                <div className="myaccount-form-inner">
                                                    <div className="single-input single-input-half">
                                                        <label>First Name*</label>
                                                        <input type="text" />
                                                    </div>
                                                    <div className="single-input single-input-half">
                                                        <label>Last Name*</label>
                                                        <input type="text" />
                                                    </div>
                                                    <div className="single-input">
                                                        <label>Email*</label>
                                                        <input type="email" />
                                                    </div>
                                                    <div className="single-input">
                                                        <label>Current Password(leave blank to leave
                                                            unchanged)</label>
                                                        <input type="password" />
                                                    </div>
                                                    <div className="single-input">
                                                        <label>New Password (leave blank to leave
                                                            unchanged)</label>
                                                        <input type="password" />
                                                    </div>
                                                    <div className="single-input">
                                                        <label>Confirm New Password</label>
                                                        <input type="password" />
                                                    </div>
                                                    <div className="single-input">
                                                        <button className="btn btn-custom-size lg-size btn-secondary btn-primary-hover rounded-0" type="submit">
                                                            <span>SAVE CHANGES</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Profile
