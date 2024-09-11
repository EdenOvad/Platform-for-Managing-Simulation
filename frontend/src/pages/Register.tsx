import { Form, FormGroup, Label, Button, Card, CardBody } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import logo1Img from '../assets/images/logo-1.png';
import toast from 'react-hot-toast';
import { RegisterUserRequest } from '../redux/api/types';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { login } from '../redux/action/action';

interface DecodedToken {
    user_id: string;
}
const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterUserRequest>();

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const onSubmit = async (data: RegisterUserRequest) => {
        await axios.post("http://localhost:8000/api/register", data)
            .then(res => {
                if (res.data === "User is already registered!") {
                    toast.error(
                        <div className="d-flex align-items-center">
                            <span className="toast-title">{res.data}</span>
                        </div>,
                        {
                            duration: 4000,
                            position: 'top-right'
                        }
                    );
                } else {
                    toast.success(
                        <div className="d-flex align-items-center">
                            <span className="toast-title">User registered successfully</span>
                        </div>,
                        {
                            duration: 4000,
                            position: 'top-right'
                        }
                    );
                    dispatch(login(res.data))
                    const decodedToken: DecodedToken = jwtDecode(String(res.data))
                    const uid: string = decodedToken.user_id
                    navigate('/simulation', { state: uid });
                }
            })
            .catch(err => {
                console.log(err.response.data)
                toast.error(
                    <div className="d-flex align-items-center">
                        <span className="toast-title">{err.response.data}</span>
                    </div>,
                    {
                        duration: 4000,
                        position: 'top-right'
                    }
                );
            });
        // registerUser(data);
    };


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
                                <h1 className="heading-3 form-title">Register</h1>
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
                                <Label>Email</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.email })}`}
                                    type="email"
                                    id="email"
                                    {...register('email', { required: true })}
                                />
                                {errors.email && <span className="text-danger">Email is required.</span>}
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
                                    Register
                                </Button>
                            </div>
                            <div className="mt-4 d-flex justify-content-center">
                                <p>
                                    <Link to="/" className="primary-link">
                                        <span>Login</span>
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

export default Register;
