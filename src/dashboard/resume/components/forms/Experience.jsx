
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import RichTextEditor from '@/dashboard/components/RichTextEditor';

import React, { useContext, useEffect, useState } from 'react'
const formField={
    title:'',
    comapanyName:'',
    city:'',
    state:'',
    startDate:'',
    endDate:'',
    workSummary:''
}
function Experience() {

    const [experienceList, setExperienceList] = useState([
        {
            formField
        }
    ]);

    const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);


    const handleChange=(index,event)=>{
        const newEntries =experienceList.slice();
        const {name, value } = event.target;
        newEntries[index][name]=value;
        setExperienceList(newEntries); 
    }

    const AddNewExperience=()=>{
        setExperienceList([...experienceList, formField])
    }

    const RemoveExperience=()=>{
        setExperienceList(experienceList=>experienceList.slice(0,-1));
    }

    useEffect(()=>{
        setResumeInfo({
            ...resumeInfo,
            experience:experienceList
        })
    },[experienceList])

    const handleRichTextEditor=(e,name,index)=>{
        const newEntries =experienceList.slice();
        newEntries[index][name]=e.target.value;
        setExperienceList(newEntries);

    }


    return (
        
          <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
            <h2 className="font-bold text-lg">Professional Experience</h2>
            <p>Add your previous experience</p>
            <div>
              {experienceList.map((item, index) => {
                return (
                  <div key={index} className="border p-3 my-5 rounded-lg">
                    {/* Position and Company */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div>
                        <label className="text-xs">Position Title</label>
                        <Input name="title"  onChange={(event) => handleChange(index, event)} />
                      </div>
                      <div>
                        <label className="text-xs">Company</label>
                        <Input name="comapanyName" onChange={(event) => handleChange(index, event)} />
                      </div>
                    </div>
    
                    {/* City and State */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div>
                        <label className="text-xs">City</label>
                        <Input name="city" onChange={(event) => handleChange(index, event)} />
                      </div>
                      <div>
                        <label className="text-xs">State</label>
                        <Input name="state" onChange={(event) => handleChange(index, event)} />
                      </div>
                    </div>
    
                    {/* Start Date and End Date */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div>
                        <label className="text-xs">Start Date</label>
                        <Input
                          type="date"
                          name="startDate"
                          onChange={(event) => handleChange(index, event)}
                        />
                      </div>
                      <div>
                        <label className="text-xs">End Date</label>
                        <Input
                          type="date"
                          name="endDate"
                          onChange={(event) => handleChange(index, event)}
                        />
                      </div>
                    </div>
    
                    {/* Work Summary */}
                    <div className="grid grid-cols-1">
                      <div className='col-span-2'>
                        <RichTextEditor
                        index={index}
                        onRichTextEditorChange={(event)=>handleRichTextEditor(event,'workSummery', index)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='flex justify-between'>
                <div className='flex gap-2'>
                <Button onClick={AddNewExperience} variant="outline" className='text-primary'>+ ADD MORE EXPERIENCE</Button>
                <Button onClick={RemoveExperience} variant="outline" className='text-primary'>- Remove MORE EXPERIENCE</Button>
                </div>
                <Button>Save</Button>
            </div>
          </div>
        
      );
}

export default Experience;
