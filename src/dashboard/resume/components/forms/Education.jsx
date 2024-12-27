import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import GlobalApi from '~/service/GlobalApi';





function Education() {
    const {resumeInfo, setResumeInfo}=useContext(ResumeInfoContext);
    const params=useParams();
    const [loading,setLoading]=useState(false);
    const[educationalList, setEducationalList]= useState([
        {
            universityName:'',
            degree:'',
            major:'',
            startDate:'',
            endDate:'',
            description:'' 
        }
    ])

    const handleChange=(event, index)=>{
        const newEntries =educationalList.slice();
        const {name, value } = event.target;
        newEntries[index][name]=value;
        setEducationalList(newEntries);
    }
    const AddNewEducation=()=>{
        setEducationalList([...educationalList,
            {
                universityName:'',
                degree:'',
                major:'',
                startDate:'',
                endDate:'',
                description:'' 
            }
        ])
    }
    const RemoveEducation=()=>{
        setEducationalList(educationalList=>educationalList.slice(0,-1));
    }
    const onSave=()=>{
        setLoading(true)
        const data={
            data:{
                education:educationalList
        }}
        GlobalApi.updateResumeDetail(params?.resumeId, data)
          .then(res => {
              setLoading(false);
              toast('Details updated!');
          })
          .catch(error => {
              setLoading(false);
              toast.error('Failed to update details: ' + (error.response?.data?.error?.message || 'Unknown error'));
          });
  };

    useEffect(()=>{
        setResumeInfo({
            ...resumeInfo,
            education: educationalList
        })
    },[educationalList])
    
    return (

    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
            <h2 className="font-bold text-lg">Education</h2>
            <p>Add your Education</p>

            <div>
                {educationalList.map((item,index)=>(
                    <div>
                        <div className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
                            <div className='col-span-2'>
                                <label>University Name</label>
                                <Input name="universityName" onChange={(e)=>handleChange(e, index)} />
                            </div>
                            <div>
                                <label>Degree</label>
                                <Input name="degree" onChange={(e)=>handleChange(e, index)} />
                            </div>
                            <div>
                                <label>Major</label>
                                <Input name="major" onChange={(e)=>handleChange(e, index)} />
                            </div>
                            <div>
                                <label>Start Date</label>
                                <Input type="date" name="startDate" onChange={(e)=>handleChange(e, index)} />
                            </div>
                            <div>
                                <label>End Date</label>
                                <Input type="date" name="endDate" onChange={(e)=>handleChange(e, index)} />
                            </div>
                            <div className='col-span-2'>
                                <label>Description</label>
                                <Textarea name="description" onChange={(e)=>handleChange(e, index)} />
                            </div>
                        </div>
                        
                    </div>
                ))}
            </div>
            <div className='flex justify-between'>
                        <div className='flex gap-2'>
                        <Button onClick={AddNewEducation} variant="outline" className='text-primary'>+ ADD MORE Education</Button>
                        <Button onClick={RemoveEducation} variant="outline" className='text-primary'>- Remove MORE Education</Button>
                        </div>
                        <Button disabled={loading} onClick={()=>onSave()}>
                        {loading?<LoaderCircle className='animate-spin' />:'Save'}    
                        </Button>
            </div>
    </div>
  )
}

export default Education