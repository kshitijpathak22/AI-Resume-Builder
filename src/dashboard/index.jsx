import React, { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import { useUser } from '@clerk/clerk-react'
import GlobalApi from "~/service/GlobalApi.js";
import ResumeCardItem from './components/ResumeCardItem';

function Dashboard() {
  const {user} = useUser();

  const [resumeList, setResumeList] = useState([]);


  useEffect(()=>{
    user&&GetResumeList()
  },[user])
/**used to get user Resume List */
  const GetResumeList = async () => {
    try {
      const data = await GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress);
      setResumeList(data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  }

  return (
    <div className='p-10 md:px-20 lg:px-32'>
      <h2 className='font-bold text-3xl text-foreground'>My Resume</h2>
      <p className='text-muted-foreground'>Start creating AI resume to your next job role</p>
      <div className='grid grid-cols-2 md:grid-cold-3 lg:grid-cols-5 mt-1 gap-5'>
        <AddResume/>
        {resumeList.length>0&&resumeList.map((resume,index)=>(
          <ResumeCardItem resume={resume} key={index} refreshData={GetResumeList} />
        ))}
      </div>
    </div>
  )
}

export default Dashboard