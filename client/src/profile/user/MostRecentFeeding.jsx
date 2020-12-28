import React from 'react'
import { NavLink } from 'react-router-dom';

function MostRecentFeeding({ fed }) {
    const moment = require('moment');

    return (
        <li>
            {`${fed.foodDescription} - `}
            <NavLink className="text-muted text-decoration-none" to={`/cat/${fed.forCat._id}`}>{fed.forCat.names[0]}</NavLink>
            <div>
                <small className="text-muted">{moment(fed.createdAt).fromNow()}</small>
            </div>

        </li>
    )
}

export default MostRecentFeeding
