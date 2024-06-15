import React from 'react'

const Checkout = () => {
    return (
        <div className="checkout-area section-space-y-axis-100">
            <div className="checkout-container">
                <div className="row">
                    <div className="col-12">
                        <div className="coupon-accordion">
                            <h3>Returning customer? <span id="showlogin">Click here to login</span></h3>
                            <div id="checkout-login" className="coupon-content">
                                <div className="coupon-info">
                                    <p className="coupon-text mb-1">Quisque gravida turpis sit amet nulla posuere lacinia. Cras sed est
                                        sit amet ipsum luctus.</p>
                                    <form action="javascript:void(0)">
                                        <p className="form-row-first">
                                            <label className="mb-1">Username or email <span className="required">*</span></label>
                                            <input type="text" />
                                        </p>
                                        <p className="form-row-last">
                                            <label>Password <span className="required">*</span></label>
                                            <input type="text" />
                                        </p>
                                        <p className="form-row">
                                            <input type="checkbox" id="remember_me" />
                                            <label for="remember_me">Remember me</label>
                                        </p>
                                        <p className="lost-password"><a href="javascript:void(0)">Lost your password?</a></p>
                                    </form>
                                </div>
                            </div>
                            <h3>Have a coupon? <span id="showcoupon">Click here to enter your code</span></h3>
                            <div id="checkout_coupon" className="coupon-checkout-content">
                                <div className="coupon-info">
                                    <form action="javascript:void(0)">
                                        <p className="checkout-coupon">
                                            <input placeholder="Coupon code" type="text" />
                                            <input className="coupon-inner_btn" value="Apply Coupon" type="submit" />
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-12">
                        <form action="javascript:void(0)">
                            <div className="checkbox-form">
                                <h3>Billing Details</h3>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="checkout-form-list">
                                            <label>Full Name <span className="required">*</span></label>
                                            <input placeholder="" type="text" />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="checkout-form-list">
                                            <label>Address <span className="required">*</span></label>
                                            <input placeholder="Street address" type="text" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="checkout-form-list">
                                            <label>Phone <span className="required">*</span></label>
                                            <input type="text" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-lg-6 col-12">
                        <div className="your-order">
                            <h3>Your order</h3>
                            <div className="your-order-table table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th className="cart-product-name">Product</th>
                                            <th className="cart-product-total">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="cart_item">
                                            <td className="cart-product-name"> Vestibulum suscipit<strong className="product-quantity">
                                                × 1</strong></td>
                                            <td className="cart-product-total"><span className="amount">$165.00</span></td>
                                        </tr>
                                        <tr className="cart_item">
                                            <td className="cart-product-name"> Vestibulum suscipit<strong className="product-quantity">
                                                × 1</strong></td>
                                            <td className="cart-product-total"><span className="amount">$165.00</span></td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr className="cart-subtotal">
                                            <th>Cart Subtotal</th>
                                            <td><span className="amount">$215.00</span></td>
                                        </tr>
                                        <tr className="order-total">
                                            <th>Order Total</th>
                                            <td><strong><span className="amount">$215.00</span></strong></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div className="payment-method">
                                <div className="payment-accordion">
                                    <div id="accordion">
                                        <div className="card">
                                            <div className="card-header" id="#payment-1">
                                                <h5 className="panel-title">
                                                    <a href="javascript:void(0)" className="" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true">
                                                        Direct Bank Transfer.
                                                    </a>
                                                </h5>
                                            </div>
                                            <div id="collapseOne" className="collapse show" data-bs-parent="#accordion">
                                                <div className="card-body">
                                                    <p>Make your payment directly into our bank account. Please use your Order
                                                        ID as the payment
                                                        reference. Your order won’t be shipped until the funds have cleared in
                                                        our account.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header" id="#payment-2">
                                                <h5 className="panel-title">
                                                    <a href="javascript:void(0)" className="collapsed" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false">
                                                        Cheque Payment
                                                    </a>
                                                </h5>
                                            </div>
                                            <div id="collapseTwo" className="collapse" data-bs-parent="#accordion">
                                                <div className="card-body">
                                                    <p>Make your payment directly into our bank account. Please use your Order
                                                        ID as the payment
                                                        reference. Your order won’t be shipped until the funds have cleared in
                                                        our account.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header" id="#payment-3">
                                                <h5 className="panel-title">
                                                    <a href="javascript:void(0)" className="collapsed" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false">
                                                        PayPal
                                                    </a>
                                                </h5>
                                            </div>
                                            <div id="collapseThree" className="collapse" data-bs-parent="#accordion">
                                                <div className="card-body">
                                                    <p>Make your payment directly into our bank account. Please use your Order
                                                        ID as the payment
                                                        reference. Your order won’t be shipped until the funds have cleared in
                                                        our account.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="order-button-payment">
                                        <input value="Place order" type="submit" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout
