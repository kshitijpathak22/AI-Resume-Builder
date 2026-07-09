import Header from '@/components/custom/Header';
import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import GlobalApi from '~/service/GlobalApi';
import { RWebShare } from 'react-web-share'
import ResumePreview from '@/dashboard/resume/components/ResumePreview';

function ViewResume() {

    const [resumeInfo,setResumeInfo]=useState();
    const {resumeId}=useParams();

    useEffect(()=>{
        GetResumeInfo();
    },[])
    const GetResumeInfo=()=>{
        GlobalApi.GetResumeById(resumeId).then(resp=>{
            console.log(resp.data.data);
            setResumeInfo(resp.data.data);
        })
    }

    const HandleDownload=()=>{
        window.print();
    }

  return (
    <ResumeInfoContext.Provider value={{resumeInfo,setResumeInfo}} >
        <div id="no-print">
        <Header/>

        <div className='my-10 mx-10 md:mx-20 lg:mx-36'>
            <h2 className='text-center text-2xl font-medium'>
                Congrats! Your Ultimate AI generates Resume is ready ! </h2>
                <p className='text-center text-muted-foreground'>Now you are ready to download your resume and you can share unique 
                    resume url with your friends and family </p>
            <div className='flex justify-between px-44 my-10'>
                <Link to={`/dashboard/resume/${resumeId}/edit`}>
                  <Button variant="outline" className="border-primary/20 hover:border-primary/50">Edit Resume</Button>
                </Link>
                <Button onClick={HandleDownload}>Download</Button>
               
                <Link to={`/my-resume/${resumeId}/interview`}>
                  <Button variant="secondary" className="border border-primary/20 hover:border-primary/50 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(14,165,233,0.2)]">Practice Interview</Button>
                </Link>

                <RWebShare
        data={{
          text: "Hello Everyone, This is my resume please open url to see it",
          url: window.location.origin+"/my-resume/"+resumeId+"/view",
          title: resumeInfo?.firstName+" "+resumeInfo?.lastName+" resume",
        }}
        onClick={() => console.log("shared successfully!")}
      > <Button>Share</Button>
      </RWebShare>
            </div>
        </div>
            
        </div>
        <div className='my-10 mx-10 md:mx-20 lg:mx-36'>
        <div id="print-area" >
                <ResumePreview/>
            </div>
            </div>
    </ResumeInfoContext.Provider>
  )
}

export default ViewResume