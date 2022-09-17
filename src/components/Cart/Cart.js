import React, {useContext, useState} from "react";

import classes from "./Cart.module.css";
import Modal from "../UI/Modal";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

const Cart = (props) => {
    const [isCheckout, setIsCheckout] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);
    const cartCtx = useContext(CartContext);
    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
    const hasItems = cartCtx.items.length > 0;

    const cartItemRemoveHandler = (id) => {
        cartCtx.removeItem(id);
    };
    const cartItemAddHandler = (item) => {
        cartCtx.addItem(item);
    };

    const orderHandler = () => {
        setIsCheckout(true);
    }

    const submitOrderHandler = async (userData) => {
        setIsSubmitting(true);
        await fetch('https://react-http-25001-default-rtdb.europe-west1.firebasedatabase.app/orders.json', {
            method: 'POST',
            body: JSON.stringify({
                    user: userData,
                    orderedItems: cartCtx.items
                }
            )
        });
        setIsSubmitting(false);
        setDidSubmit(true);
        cartCtx.clearCart();
    }

    const cartItems = (
        <ul className={classes["cart-items"]}>
            {cartCtx.items.map((item) => {
                return (
                    <CartItem
                        key={item.id}
                        name={item.name}
                        amount={item.amount}
                        price={item.price}
                        onAddItem={cartItemAddHandler.bind(null, item)}
                        onRemoveItem={cartItemRemoveHandler.bind(null, item.id)}
                    />
                );
            })}
        </ul>
    );
    const modalActions = (
        <div className={classes.actions}>
            <button onClick={props.onCloseCart} className={classes["button--alt"]}>
                Close
            </button>
            {hasItems && <button onClick={orderHandler} className={classes.button}>Order</button>}
        </div>
    );
    const cartModalContent = (
        <React.Fragment>
            {cartItems}
            <div className={classes.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            {isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onCloseCart}/>}
            {!isCheckout && modalActions}
        </React.Fragment>
    );
    const isSubmittingModalContent = (
        <p>Sending order data...</p>
    )
    const didSubmitModalContent = (
        <p>Successfully sent the order!</p>
    )
    return (
        <Modal onClose={props.onCloseCart}>
            {!isSubmitting && !didSubmit && cartModalContent}
            {isSubmitting && isSubmittingModalContent}
            {!isSubmitting && didSubmit && didSubmitModalContent}
        </Modal>
    );
};
export default Cart;
