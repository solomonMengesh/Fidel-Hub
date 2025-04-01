import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
    return (
            <Link
                to="/"
                className="text-2xl font-display font-bold text-fidel-900 dark:text-white flex items-center"
            >
                <span className="bg-fidel-500 text-white h-8 w-8 rounded-lg flex items-center justify-center mr-2 shadow-lg">
                    F
                </span>
                Fidel<span className="text-fidel-500">Hub</span>
            </Link>
    );
}

export default Logo;
