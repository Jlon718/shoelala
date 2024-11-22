// export default Register;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MetaData from '../Layout/MetaData';

const Register = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        avatar: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const onChange = (e) => {
        if (e.target.name === 'avatar') {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setUser({ ...user, avatar: reader.result.split(',')[1] }); // Remove the data URL prefix
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await axios.post('/api/auth/register', userData);
            setUser(data.user);
            navigate('/');
        } catch (error) {
            setLoading(false);
            setUser(null);
            setError(error.response.data.message);
            console.log(error.response.data.message);
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        setLoading(true);
        register(user);
    };

    const { name, email, password, phone, address, avatar } = user || {};

    return (
        <>
            <MetaData title={'Register User'} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label htmlFor="name_field">Name</label>
                            <input
                                type="text"
                                id="name_field"
                                className="form-control"
                                name="name"
                                value={name}
                                onChange={onChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name="email"
                                value={email}
                                onChange={onChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                name="password"
                                value={password}
                                onChange={onChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone_field">Phone</label>
                            <input
                                type="text"
                                id="phone_field"
                                className="form-control"
                                name="phone"
                                value={phone}
                                onChange={onChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address_field">Address</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                name="address"
                                value={address}
                                onChange={onChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="avatar_upload">Avatar</label>
                            <input
                                type="file"
                                id="avatar_upload"
                                className="form-control"
                                name="avatar"
                                onChange={onChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;