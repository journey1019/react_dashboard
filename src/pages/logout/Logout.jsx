import React from 'react';

function Logout(props) {
    // get the username data from the session storage
    const username = sessionStorage.getItem('username');
    if (username) return JSON.parse(username);
    else return null;

    // handle click event of logout button
    const handleLogout = () => {
        // remove the token and username from the session storage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        props.history.push('/login');
    }

    return (
        <div>
            Welcome {username}!<br /><br />
            <input type="button" onClick={handleLogout} value="Logout" />
        </div>
    );
}

export default Logout;