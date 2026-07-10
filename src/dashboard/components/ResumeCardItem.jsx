import { Loader2Icon, MoreVertical, FileText } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import GlobalApi from '~/service/GlobalApi'
import { toast, Toaster } from 'sonner'
import { useAuth } from '@clerk/clerk-react'

function ResumeCardItem({resume,refreshData}) {

  const navigation=useNavigate();
  const [openAlert,setOpenAlert]=useState(false);
  const [loading,setLoading]=useState(false);
  const { getToken } = useAuth();
  // const onMenuClick=(url)=>{
  //   navigation(url)
  // }


  const onDelete = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      await GlobalApi.DeleteResumeById(resume.id, token);
      toast('Resume Deleted!');
      refreshData();
      setOpenAlert(false);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setLoading(false);
    }
  }
  return (
    
       <div className='group active:scale-[0.97] transition-transform duration-200 cursor-pointer'>
          <Link to={'/dashboard/resume/'+resume.id+"/edit"}>
        <div className='p-14 card-glass h-[280px] rounded-t-xl border-t-4 transition-all hover:border-primary hover:shadow-[0_0_2rem_-0.5rem_rgba(91,63,217,0.5)] relative flex flex-col items-center justify-center'
        style={{
          borderColor:resume?.themeColor || 'var(--primary)'
        }}
        >
              <div className='flex flex-col items-center justify-center h-[180px] w-full'>
                <div className="icon-glass group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-300 w-24 h-32 flex flex-col gap-1.5 p-2 bg-white/10 dark:bg-black/10 border-white/30 items-start justify-start overflow-hidden">
                  {/* Miniature Resume Skeleton */}
                  <div className="w-3/4 h-2 rounded-full mb-1" style={{ backgroundColor: resume?.themeColor || 'var(--primary)' }}></div>
                  <div className="w-full h-1 bg-muted-foreground/30 rounded-full"></div>
                  <div className="w-full h-1 bg-muted-foreground/30 rounded-full"></div>
                  <div className="w-5/6 h-1 bg-muted-foreground/30 rounded-full"></div>
                  
                  <div className="w-1/2 h-1.5 rounded-full mt-2" style={{ backgroundColor: resume?.themeColor || 'var(--primary)' }}></div>
                  <div className="w-full h-1 bg-muted-foreground/30 rounded-full"></div>
                  <div className="w-4/5 h-1 bg-muted-foreground/30 rounded-full"></div>
                  <div className="w-full h-1 bg-muted-foreground/30 rounded-full"></div>
                  <div className="w-2/3 h-1 bg-muted-foreground/30 rounded-full"></div>
                </div>
                
                <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center inset-0 bg-background/60 backdrop-blur-sm rounded-t-xl z-10">
                  <span className="text-primary font-semibold tracking-wide bg-background/90 px-5 py-2 rounded-full border border-white/20 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-center">
                    {resume.title}<br/>
                    <span className="text-xs font-normal text-muted-foreground">Click to Edit</span>
                  </span>
                </div>
              </div>
        </div>
        </Link>
        <div className='border border-t-0 p-3 flex justify-between text-white rounded-b-xl shadow-lg backdrop-blur-xl'
         style={{
          background:resume?.themeColor ? `${resume.themeColor}dd` : 'rgba(91, 63, 217, 0.8)'
        }}>
          <h2 className='text-sm font-medium truncate'>{resume.title}</h2>
         
          <DropdownMenu>
          <DropdownMenuTrigger>
          <MoreVertical className='h-4 w-4 cursor-pointer'/>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
           
            <DropdownMenuItem  onClick={()=>navigation('/dashboard/resume/'+resume.id+"/edit")}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>navigation('/my-resume/'+resume.id+"/view")}>View</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>navigation('/my-resume/'+resume.id+"/view")}>Download</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>setOpenAlert(true)}>Delete</DropdownMenuItem>
            
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={openAlert}>
        
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=>setOpenAlert(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} 
            disabled={loading}>
              {loading? <Loader2Icon className='animate-spin'/>:'Delete'}
              </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

        </div>
        </div>

  )
}

export default ResumeCardItem