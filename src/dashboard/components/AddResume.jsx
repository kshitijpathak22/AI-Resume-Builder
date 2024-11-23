import { Loader2, PlusSquare } from 'lucide-react'
import React, { useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import GlobalApi from "~/service/GlobalApi.js";




import { useUser } from '@clerk/clerk-react';


function AddResume() {

    const[openDialog,setOpenDialog] = useState(false)
    const[resumeTitle, setResumeTitle] = useState();
    const {user} = useUser();
    const[loading,setLoading] = useState(false);

    const onCreate=()=>{
        setLoading(true)
        const uuid =uuidv4();;
        const data={
            data:{
                title:resumeTitle,
                resumeId:uuid,
                userEmail:user?.primaryEmailAddress?.emailAddress,
                userName:user?.fullName
            }
        }

        GlobalApi.CreateNewResume(data).then(resp=>{
            console.log(resp);
            if(resp){
                setLoading(false);
            }
        },(error)=>{
            setLoading(false);
        }
    )
    }
  return (
    <div>
        <div className='p-14 py-24 
        border items-center flex justify-center bg-secondary
        rounded-lg h-[280px]
        hover:scale-105 transition-all hover:shadow-md cursor-pointer
        border-dotted'
        onClick={()=>setOpenDialog(true)}>
            <PlusSquare/>
        </div>

        <Dialog open={openDialog}>

            <DialogContent>
                <DialogHeader>
                <DialogTitle>Create new Resume</DialogTitle>
                <DialogDescription>
                    <p>Add a title for new resume </p>
                    <Input className="mt-2" placeholder="Ex.Full stack " 
                        onChange={(e)=>setResumeTitle(e.target.value)}
                    />
                </DialogDescription>
                <div className='flex justify-end gap-5'>
                    <Button onClick={()=>setOpenDialog(false)} variant="secondary">Cancel</Button>
                    <Button
                        disabled={!resumeTitle||loading}
                    onClick={()=>onCreate()}>{
                        loading?
                        <Loader2 className='animate-spin' /> :'Create'
                    } </Button>
                </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
 
    </div>
  )
}

export default AddResume