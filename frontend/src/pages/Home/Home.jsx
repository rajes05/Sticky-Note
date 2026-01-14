import { useEffect, useState } from "react"
import {motion, AnimatePresence} from 'framer-motion'
import Navbar from "../../components/Navbar/Navbar"
import NoteCard from '../../components/Cards/NoteCard'
import {MdAdd, MdOutlineNotes} from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosinstance"
import EmptyCard from '../../components/EmptyCard/EmptyCard'

export default function Home() {
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShow:false,
        type:"add",
        data:null,
    })

    const [allNotes, setAllNotes] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [isSearch, setIsSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    
    const handleEdit = (noteDetails) =>{
        setOpenAddEditModal({
            isShow:true,
            type:"edit",
            data:noteDetails
        })
    }

    const getUserInfo = async()=>{
        try {
            const response = await axiosInstance.get('/get-user');
            if(response.data?.user){
                setUserInfo(response.data.user)
            }
        } catch (error) {
            if(error.response?.status=== 401){
                localStorage.clear()
                navigate("/login")
            }
            
        }
    }

    const getAllNotes = async()=>{
        setIsLoading(true);
        try {
            const response = await axiosInstance.get("/get-all-notes");
            if(response.data?.notes) {
                setTimeout(()=>{
                    setAllNotes(response.data.notes);
                    setIsLoading(false);
                },500);
            }
        } catch (error) {
            console.log("An unexpected error occured.", error)
            setIsLoading(false)
        }
    }

    const deleteNote = async(data) =>{
        try {
            const response = await axiosInstance.delete(`/delete-note/${data._id}`);
            if(response.data && !response.data.error){
                getAllNotes();
            }
        } catch (error) {
            console.log("Error in delete note: ",error)
        }
    }

    const onSearchNote = async(query)=>{
        setIsLoading(true);
        try {
            const response = await axiosInstance.get("/search-notes", {
                params:query
            });
            if(response.data?.notes){
                setIsSearch(true);
                setTimeout(()=>{
                    setAllNotes(response.data.notes);
                    setIsLoading(false);
                },500);
            }
        } catch (error) {
            console.log("Search note error: ",error);
            setIsLoading(false)
        }
    }
    const updateIsPinned = async(noteData)=>{
        try {
            const response = await axiosInstance.put(`update-note-pinned/${noteData._id}`,
                {
                    isPinned:!noteData.isPinned
                }
            );
            if(response.data?.note){
                getAllNotes();
            }
        } catch (error) {
            console.log("Update pin error: ",error);
        }
    }

    const handleClearSearch = ()=>{
        setIsSearch(false);
        getAllNotes();
    }

    useEffect(()=>{
        getAllNotes();
        getUserInfo();
    }, [])
    return (
        <div>
            Home
        </div>
    )
}