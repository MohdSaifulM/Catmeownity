import React from 'react'
import Axios from 'axios'
import { useParams, NavLink } from 'react-router-dom'
import { decode } from "jsonwebtoken"
import { ListGroupItem, Modal } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import ConfirmDeleteComment from './ConfirmDeleteComment'

function CatComments({ desc, fetchCat }) {

    let token = localStorage.getItem('token')
    let user = decode(token);
    Axios.defaults.headers.common['x-auth-token'] = token;
    let { id } = useParams()
    const [ownComment, setOwnComment] = useState(false);
    const [confirmDel, setConfirmDel] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState("")

    var moment = require('moment')
    function confirmDelComment(commentID) {
        setConfirmDel(true);
        setCommentIdToDelete(commentID)
    }

    async function deleteCatDescription() {
        try {
            await Axios.delete(`/api/auth/comment/${desc._id}/${user.user._id}/${id}`);
            fetchCat()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (user && user.user._id === desc.byUser._id) {
            setOwnComment(true)
        } else {
            setOwnComment(false)
        }
    }, [])


    return (
        <div>
            <ListGroupItem>
                <div className="d-flex bd-highlight mb-3">
                    <div className="font-weight-bold p-2 bd-highlight">
                        <NavLink className="text-muted text-decoration-none" exact to={`/profile/${desc.byUser._id}`}>{desc.byUser && desc.byUser.name}</NavLink>
                    </div>
                    <div className="font-weight-bold p-2 bd-highlight">
                        {desc.catDescription}
                    </div>
                    <div className="d-flex text-muted ml-auto p-2 bd-highlight">

                        <div>{moment(desc.createdAt).fromNow()}</div>
                        <div className="mx-4">
                            {ownComment && <div>
                                <button type="button" className="close" aria-label="Close" onClick={()=>confirmDelComment(desc._id)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>}
                        </div>
                    </div>
                </div>
            </ListGroupItem>
            <Modal show={confirmDel} onHide={() => (setConfirmDel(false))}>
                <ConfirmDeleteComment setConfirmDel={setConfirmDel} delComment={() => deleteCatDescription(commentIdToDelete)} />
            </Modal>
        </div>
    )
}

export default CatComments
