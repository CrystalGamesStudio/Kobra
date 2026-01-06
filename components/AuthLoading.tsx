import React from 'react';

const AuthLoading: React.FC = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-[var(--bg-color)]">
            <div className="loader">
              <div className="box1"></div>
              <div className="box2"></div>
              <div className="box3"></div>
            </div>
        </div>
    );
};

export default AuthLoading;