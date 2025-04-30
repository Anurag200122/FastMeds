import { Button, TextField, Typography, Checkbox, FormControlLabel, Link } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../State/Authentication/Action'

const initialValues = {
    email: "",
    password: "",
    rememberMe: false
}

const LoginForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // ✅ Access login error from Redux
    const error = useSelector((state) => state.auth.error)

    const handleSubmit = (values) => {
        dispatch(loginUser({ userData: values, navigate }))
    }

    return (
        <div>
            <Typography variant='h5' className='text-center'>
                Login
            </Typography>

            <Formik onSubmit={handleSubmit} initialValues={initialValues}>
                {() => (
                    <Form>
                        <Field
                            as={TextField}
                            name="email"
                            label="Email"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        />
                        <Field
                            as={TextField}
                            name="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                        />

                        {/* ✅ Show error message if login fails */}
                        {error && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {typeof error === 'string'
                                    ? error
                                    : 'Email or password is incorrect.'}
                            </Typography>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <FormControlLabel
                                control={
                                    <Field
                                        as={Checkbox}
                                        name="rememberMe"
                                        color="primary"
                                    />
                                }
                                label="Remember me"
                            />
                            <Link
                                onClick={() => navigate("/account/forgot-password")}
                                variant="body2"
                                style={{ cursor: "pointer" }}
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <Button sx={{ mt: 2, padding: "1rem" }} fullWidth type='submit' variant='contained'>
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>

            <Typography variant='body2' align='center' sx={{ mt: 3 }}>
                Don't have an account?
                <Button size='small' onClick={() => navigate("/account/register")}>
                    register
                </Button>
            </Typography>
        </div>
    )
}

export default LoginForm
