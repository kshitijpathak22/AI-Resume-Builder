import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FormSection from '../../components/FormSection';
import ResumePreview from '../../components/ResumePreview';
import { useAuth } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';
import FreeformEditor from '../../components/FreeformEditor';
import FreeformPreview from '../../components/FreeformPreview';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import GlobalApi from '~/service/GlobalApi';


function EditResume() {
  const {resumeId}=useParams();
  const [resumeInfo,setResumeInfo]=useState();
  const { getToken } = useAuth();
  
  useEffect(()=>{
      GetResumeInfo();
  },[])


  const GetResumeInfo = async () => {
    try {
      const token = await getToken();
      const data = await GlobalApi.GetResumeById(resumeId, token);
      console.log(data);
      setResumeInfo(data);
    } catch (error) {
      console.error("Error loading resume:", error);
    }
  }

return (
  <ResumeInfoContext.Provider value={{resumeInfo,setResumeInfo}}>
  <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10'>
      {/* Form Section  */}
      {!resumeInfo ? (
          <div className="flex items-center justify-center h-[500px] w-full col-span-2">
             <Loader2 className="animate-spin text-primary w-10 h-10" />
          </div>
      ) : resumeInfo?.isFreeform ? (
          <>
            <FreeformEditor />
            <FreeformPreview />
          </>
      ) : (
          <>
            <FormSection/>
            <ResumePreview/>
          </>
      )}
  </div>
  </ResumeInfoContext.Provider>
)
}

export default EditResume