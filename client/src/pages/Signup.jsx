import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../features/slice/alertSlice';

const Signup = () => {
  const { signupType } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function generatePatientID() {
    const min = 100000; 
    const max = 999999; 
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    phone: '+92', 
    ispatient: null,
    isdoctor: null,
    patientId: null
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });


  useEffect(() => {
    if (signupType === 'doctor-signup') {
      setValues(prev => ({ ...prev, isdoctor: true, ispatient: false, patientId: null }));
    } else if (signupType === 'patient-signup') {
      const patientID = generatePatientID();
      setValues(prev => ({ ...prev, ispatient: true, isdoctor: false, patientId: patientID }));
    } else {
      setValues(prev => ({ ...prev, isdoctor: null, ispatient: null, patientId: null }));
    }
  }, [signupType]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9+]/g, ''); 
      setValues(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setValues(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: '' })); 
  };

  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    if (!values.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!values.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    }

    if (!values.password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    if (!values.phone.trim() || values.phone.length < 10) {
      newErrors.phone = 'Valid phone number is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const submitHandler = async (e) => {
    e.preventDefault(); 

    if (!validateForm()) return; 

    try {
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/signup', values);
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        if (signupType === 'doctor-signup') {
          navigate('/login/doctor-login');
        } else {
          navigate('/login/patient-login');
        }
        setValues({ name: '', email: '', password: '', phone: '+92', ispatient: null, isdoctor: null, patientId: null });
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div>
      <section className="relative flex flex-wrap lg:h-screen lg:items-center">
        <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24 shadow">
          <div className="mx-auto max-w-lg text-center">
            {values.isdoctor && (
              <h1 className="text-2xl font-bold sm:text-3xl">Sign up as Doctor</h1>
            )}
            {values.ispatient && (
              <h1 className="text-2xl font-bold sm:text-3xl">Sign up as Patient</h1>
            )}
          </div>

          <form className="mx-auto mb-0 mt-8 max-w-md space-y-4" onSubmit={submitHandler}>
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleOnChange}
                  className={`w-full rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  } p-4 pe-12 text-sm shadow-sm`}
                  placeholder="Enter Name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleOnChange}
                  className={`w-full rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  } p-4 pe-12 text-sm shadow-sm`}
                  placeholder="Enter email"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleOnChange}
                  className={`w-full rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  } p-4 pe-12 text-sm shadow-sm`}
                  placeholder="Enter password"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="sr-only">
                Phone
              </label>
              <div className="">
                <input
                  type="text"
                  name="phone"
                  value={values.phone}
                  onChange={handleOnChange}
                  className={`w-full rounded-lg border ${
                    errors.phone ? 'border-red-500' : 'border-gray-200'
                  } p-4  text-sm shadow-sm`}
                  placeholder="Enter phone number"
                  maxLength={13}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Already have an account?
                <a className="underline" href="#">
                  Log in
                </a>
              </p>

              <button
                type="submit"
                className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>

        <div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1516841273335-e39b37888115?q=80&w=1447&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>
    </div>
  );
};

export default Signup;
