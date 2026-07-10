import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { data } from 'browserslist';
import { LoaderCircle, LoaderIcon } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import GlobalApi from "~/service/GlobalApi.js";


function PersonalDetail({enabledNext}) {

  const params=useParams();
  const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext)

  const [formData,setFormData]=useState();
  const [loading,setLoading]=useState(false);
  useEffect(()=>{
      console.log("---",resumeInfo)
  },[])

  const handleInputChange=(e)=>{
      enabledNext(false)
      const {name,value}=e.target;

      setFormData({
          ...formData,
          [name]:value
      })
      setResumeInfo({
          ...resumeInfo,
          [name]:value
      })
  }

  const onSave = async (e) => {
      e.preventDefault();
      setLoading(true)
      try {
          await GlobalApi.UpdateResumeDetail(params?.resumeId, formData);
          enabledNext(true);
          toast("Details updated")
      } catch (error) {
          console.error("Save error:", error);
      } finally {
          setLoading(false);
      }
  }
return (
  <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Personal Detail</h2>
      <p>Get Started with the basic information</p>

      <form onSubmit={onSave}>
          <div className='grid grid-cols-2 mt-5 gap-3'>
              <div>
                  <label className='text-sm'>First Name</label>
                  <Input name="firstName" defaultValue={resumeInfo?.firstName} required onChange={handleInputChange}  />
              </div>
              <div>
                  <label className='text-sm'>Last Name</label>
                  <Input name="lastName" required onChange={handleInputChange} 
                  defaultValue={resumeInfo?.lastName} />
              </div>
              <div className='col-span-2'>
                  <label className='text-sm'>Job Title</label>
                  <Input name="jobTitle" required 
                  defaultValue={resumeInfo?.jobTitle}
                  onChange={handleInputChange}  />
              </div>
              <div className='col-span-2'>
                  <label className='text-sm'>Address <span className='text-muted-foreground text-xs'>(Optional)</span></label>
                  <Input name="address"
                  defaultValue={resumeInfo?.address}
                  onChange={handleInputChange}  />
              </div>
              <div>
                  <label className='text-sm'>Phone</label>
                  <Input name="phone" required 
                  defaultValue={resumeInfo?.phone}
                  onChange={handleInputChange}  />
              </div>
              <div>
                  <label className='text-sm'>Email</label>
                  <Input name="email" required 
                  defaultValue={resumeInfo?.email}
                  onChange={handleInputChange}  />
              </div>
          </div>
          <div className='mt-3 flex justify-end'>
              <Button type="submit"
              disabled={loading}>
                  {loading?<LoaderCircle className='animate-spin' />:'Save'}
                  </Button>
          </div>
      </form>
  </div>
)
}

export default PersonalDetail