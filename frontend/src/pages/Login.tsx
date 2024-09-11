/* eslint-disable react-hooks/exhaustive-deps */
import { Form, FormGroup, Label, Button, Card, CardBody } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import logo1Img from '../assets/images/logo-1.png';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { X } from 'react-feather';
import { LoginUserRequest } from '../redux/api/types';
import axios from 'axios';
import { login } from '../redux/action/action';
import {jwtDecode} from 'jwt-decode'

interface DecodedToken {
    user_id: string;
}

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginUserRequest>();

    const [isSuccess, setIssuccess] = useState(false)
    const [isError, setError] = useState("")
    const [uId, setUid] = useState("")

    const navigate = useNavigate();
    const dispatch = useDispatch()
    

    const onSubmit = async (data: LoginUserRequest) => {        
        await axios.post("http://localhost:8000/api/login",data)
            .then(res => {                
                dispatch(login(res.data))
                const decodedToken:DecodedToken = jwtDecode(String(res.data))
                const uid:string = decodedToken.user_id
                setUid(uid)
                setIssuccess(true)
                // loginUser()
            })
            .catch(err => {
                alert(err.response.data.detail)
            });
        // loginUser(data);
    };

    useEffect(() => {
        if (isSuccess === true) {
            
            // const user = getUserData();
            // const userInfo = JSON.parse(user);
            // console.log(userInfo);
            toast(
                (t) => (
                    <div className="d-flex">
                        <div className="d-flex flex-column">
                            <div className="d-flex justify-content-between">
                                {/* <h6>{userInfo.username}</h6> */}
                                <X size={12} className="cursor-pointer" onClick={() => toast.dismiss(t.id)} />
                            </div>
                            <span className="small">You have successfully logged in as an user. Enjoy!</span>
                        </div>
                    </div>
                ),
                {
                    duration: 4000,
                    position: 'top-right'
                }
            );
            navigate('/simulation',{state:uId});
        }

        if (isError) {
            toast.error(
                <div className="d-flex align-items-center">
                    <span className="toast-title">{isError}</span>
                </div>,
                {
                    duration: 4000,
                    position: 'top-right'
                }
            );
        }
    }, [isError, isSuccess, navigate]);

    return (
        <div className="auth-wrapper auth-v1 px-2 auth-background">
            <div className="auth-inner py-2">
                <Card className="mb-0">
                    <CardBody>
                        <div className="mb-4 d-flex justify-content-center">
                            <img className="logo" src={logo1Img} alt="SmartSitter" />
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <h1 className="heading-3 form-title">Login with your account</h1>
                            </div>
                        </div>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <FormGroup>
                                <Label>Username</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.username })}`}
                                    type="text"
                                    id="username"
                                    {...register('username', { required: true })}
                                />
                                {errors.username && <span className="text-danger">Username is required.</span>}
                            </FormGroup>
                            <FormGroup>
                                <Label>Password</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.password })}`}
                                    type="password"
                                    id="password"
                                    {...register('password', { required: true })}
                                />
                                {errors.password && <span className="text-danger">Password is required.</span>}
                            </FormGroup>
                            <div className="mt-4">
                                <Button color="danger" className="btn-block w-100" type="submit">
                                    LOGIN
                                </Button>
                            </div>
                            <div className="mt-4 d-flex justify-content-center">
                                <p>
                                    Not a member? 
                                    <Link to="/register" className="primary-link">
                                        <span>Register</span>
                                    </Link>{' '}
                                </p>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default Login;
