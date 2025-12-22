import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex w-full">
            {/* Left Side - Image/Brand */}
            <div className="hidden lg:flex lg:w-1/2 bg-black text-white relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* Abstract Premium Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
                    {/* You could add a real image here later */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                </div>

                <div className="relative z-10 p-12 text-center">
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">Sopy.</h1>
                    <p className="text-xl text-gray-300 font-light max-w-md mx-auto">
                        Experience the next generation of commerce. Premium, fast, and secure.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h2>
                        {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
                    </div>

                    <div className="mt-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
