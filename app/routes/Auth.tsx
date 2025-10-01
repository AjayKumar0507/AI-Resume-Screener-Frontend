import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '~/context/AuthContext';
import LoginForm from '~/components/LoginForm';
import RegisterForm from '~/components/RegisterForm';

const Auth = () => {
    const location = useLocation();
    const next = location.search.split("next=")[1] || "/";
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [showLogin, setShowLogin] = useState(true);

    useEffect(() => {
        if (isLoggedIn) navigate(next);
    }, [isLoggedIn, navigate, next]);

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg p-10 bg-white rounded-2xl w-full max-w-md">
                <div className="flex flex-col items-center gap-4 text-center mb-6">
                    <h1>Welcome</h1>
                    <h2>{showLogin ? "Log in to Continue Your Job Journey" : "Register to Start Your Journey"}</h2>
                </div>

                {showLogin ? (
                    <div className="flex flex-col gap-4">
                        <LoginForm onSuccess={() => navigate(next)} />
                        <p className="text-sm text-center mt-2">
                            Don't have an account?{' '}
                            <button
                                onClick={() => setShowLogin(false)}
                                className="text-blue-500 underline"
                            >
                                Register
                            </button>
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <RegisterForm onSuccess={() => navigate(next)} />
                        <p className="text-sm text-center mt-2">
                            Already have an account?{' '}
                            <button
                                onClick={() => setShowLogin(true)}
                                className="text-blue-500 underline"
                            >
                                Log in
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Auth;
