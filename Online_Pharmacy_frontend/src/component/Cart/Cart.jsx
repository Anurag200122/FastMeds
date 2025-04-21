import React, { useEffect, useState } from 'react';
import CartItem from './CartItem.jsx';
import { Box, Button, Card, Divider, Grid, Modal, TextField, CircularProgress } from '@mui/material';
import AddressCard from './AddressCard';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../State/Order/Action.js';
import { clearCartAction, findCart } from '../State/Cart/Action.js';
import { useNavigate } from 'react-router-dom';

export const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    outline: 'none',
    boxShadow: 24,
    p: 4,
};

const initialValues = {
    streetAddress: "",
    city: "",
    state: "",
    pincode: ""
};

// Utility function to normalize address strings
const normalizeAddressString = (str) => {
    return str.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^\w\s]/g, '');
};

// Function to filter out duplicate addresses
const getUniqueAddresses = (addresses) => {
    const uniqueAddresses = [];
    const seen = new Set();
    
    addresses.forEach(address => {
        const street = normalizeAddressString(address.streetAddress || '');
        const city = normalizeAddressString(address.city || '');
        const zip = normalizeAddressString(address.postalCode || '');
        
        const addressKey = `${street}-${city}-${zip}`;
        
        if (!seen.has(addressKey)) {
            seen.add(addressKey);
            uniqueAddresses.push(address);
        }
    });
    
    return uniqueAddresses;
};

const Cart = () => {
    const [selectedAddress, setSelectedAddress] = useState(null);
    const { cart, auth } = useSelector(store => store);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Get valid, unique addresses
    const validAddresses = getUniqueAddresses(
        auth.user?.address?.filter(address => 
            address.streetAddress && address.city && address.postalCode
        ) || []
    );

    const handleOpenAddressModal = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            dispatch(findCart(jwt));
        }
    }, [dispatch]);

    

    const createOrderUsingSelectedAddress = (address) => {
        setSelectedAddress(address);
        if (cart.cartItems.length > 0) {
            handleSubmit({
                streetAddress: address.streetAddress,
                city: address.city,
                state: address.stateProvince || "MA",
                pincode: address.postalCode
            });
        }
    };

    const handleSubmit = async (value) => {
        setIsSubmitting(true); // Set loading state
        
        try {
            const data = {
                jwt: localStorage.getItem("jwt"),
                order: {
                    pharmacyId: cart.cartItems[0]?.medicine?.pharmacy.id,
                    deliveryAddress: {
                        fullName: auth.user?.fullName,
                        streetAddress: value.streetAddress,
                        city: value.city,
                        state: value.state,
                        postalCode: value.pincode,
                        country: "USA"
                    }
                }
            };
    
            // Dispatch the order creation
            await dispatch(createOrder(data));
            
            // Clear the cart after successful order placement
            await dispatch(clearCartAction());
            
            console.log("Order placed and cart cleared");
            navigate("/my-profile/orders");
        } catch (error) {
            console.error("Error placing order:", error);
            // Handle error (you might want to show an error message)
        } finally {
            setIsSubmitting(false); // Reset loading state
        }
    };
           
        
    return (
        <>
            <main className='lg:flex justify-between'>
                <section className='lg:w-[30%] space-y-6 lg:min-h-screen pt-10'>
                    {cart.cartItems.length > 0 ? (
                        cart.cartItems.map((item) => (
                            <CartItem key={item.id} item={item} />
                        ))
                    ) : (
                        <p className="px-5">Your cart is empty.</p>
                    )}
                    <Divider />
                    <div className='billDetails px-5 text-sm'>
                        <p className='font-extralight py-5'>Bill Details</p>
                        <div className='space-y-3'>
                            <div className='flex justify-between text-gray-400'>
                                <p>Item Total</p>
                                <p>${cart.cart?.total?.toFixed(2) || "0.00"}</p>
                            </div>
                            <div className='flex justify-between text-gray-400'>
                                <p>Delivery Fee</p>
                                <p>$5.00</p>
                            </div>
                            <div className='flex justify-between text-gray-400'>
                                <p>Tax & Other Fee</p>
                                <p>$1.00</p>
                            </div>
                            <Divider />
                        </div>
                        <div className='flex justify-between text-gray-400'>
                            <p>Total Pay</p>
                            <p>${((cart.cart?.total || 0) + 6).toFixed(2)}</p>
                        </div>

                        <div className='mt-6 flex justify-between ' >
                        <Button 
                        variant="contained" 
                        onClick={handleOpenAddressModal}
                        disabled={cart.cartItems.length === 0}
                        fullWidth
                        sx={{ mx: 2, mb: 2 }}
                    >
                        Proceed to Checkout
                    </Button>
                    </div>
                    </div>
                   
                </section>
                <Divider orientation='vertical' flexItem />
                
<section className='lg:w-[70%] flex justify-center px-5 pb-10 lg:pb-0'>
    <div>
        <h1 className='text-center font-semibold text-2xl py-10'>
            Choose Delivery Address
        </h1>
        <div className='flex gap-5 flex-wrap justify-center'>
            {validAddresses.map((address) => (
                <AddressCard 
                    key={address.id}
                    item={address}
                    handleSelectAddress={createOrderUsingSelectedAddress}
                    showButton={true}
                    selected={selectedAddress?.id === address.id}
                />
            ))}
            
            <Card className="flex gap-5 w-64 p-5">
                <AddLocationIcon />
                <div className='space-y-3 text-gray-500'>
                    <h1 className='font-semibold text-lg text-white'>Add New Address</h1>
                    <Button 
                        variant='outlined' 
                        fullWidth 
                        onClick={handleOpenAddressModal}
                    >
                        Add
                    </Button>
                </div>
            </Card>
        </div>
    </div>
</section>
            </main>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Formik 
                        initialValues={initialValues} 
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting: formikSubmitting }) => (
                            <Form>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Field
                                            as={TextField}
                                            name="streetAddress"
                                            label="Street Address"
                                            fullWidth
                                            variant="outlined"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            as={TextField}
                                            name="city"
                                            label="City"
                                            fullWidth
                                            variant="outlined"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            as={TextField}
                                            name="state"
                                            label="State"
                                            fullWidth
                                            variant="outlined"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            as={TextField}
                                            name="pincode"
                                            label="Zip Code"
                                            fullWidth
                                            variant="outlined"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button 
                                            fullWidth 
                                            variant='contained' 
                                            type='submit' 
                                            color='primary'
                                            disabled={formikSubmitting || isSubmitting}
                                        >
                                            {formikSubmitting || isSubmitting ? (
                                                <CircularProgress size={24} />
                                            ) : (
                                                'Place Order'
                                            )}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Modal>
        </>
    );
};

export default Cart;
