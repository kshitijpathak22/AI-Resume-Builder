import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import GlobalApi from "~/service/GlobalApi.js";
import InterviewSelectionCard from './components/InterviewSelectionCard';
import { Loader2 } from 'lucide-react';
import Header from '@/components/custom/Header';

function InterviewDashboard() {
  const {user} = useUser();
  const [resumeList, setResumeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    user&&GetResumeList()
  },[user])

  const GetResumeList = async () => {
    setLoading(true);
    try {
      const data = await GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress);
      setResumeList(data);
    } catch (e) {
      console.error("Error fetching resumes:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className='p-10 md:px-20 lg:px-32 max-w-7xl mx-auto'>
        <h2 className='font-bold text-3xl text-foreground'>Interview Prep</h2>
        <p className='text-muted-foreground'>Select a resume to use as context for your AI Mock Interview.</p>
        
        {loading ? (
            <div className="flex justify-center mt-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        ) : (
            <div className='grid grid-cols-2 md:grid-cold-3 lg:grid-cols-4 mt-8 gap-5'>
                {resumeList.length>0 ? resumeList.map((resume,index)=>(
                    <InterviewSelectionCard resume={resume} key={index} />
                )) : (
                    <div className="col-span-full text-center py-20 text-muted-foreground border border-dashed border-border/50 rounded-xl bg-card/5 backdrop-blur-sm">
                        <p>No resumes found. Please build a resume first.</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  )
}

export default InterviewDashboard
