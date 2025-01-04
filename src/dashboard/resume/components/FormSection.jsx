import React, { useState } from 'react'
import PersonalDetail from './forms/PersonalDetail'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react'
import Summery from './forms/Summery';
import Experience from './forms/Experience';
import Education from './forms/Education';
import Skills from './forms/Skills';

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] =useState(1);
  const [enableNext, setEnableNext] = useState(false);

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        {/* Personal Details  */}
        <Button variant="outline" size="sm" 
        className="flex gap-2"> <LayoutGrid/> Theme</Button>
        <div className="flex gap-2 items-center">
          {activeFormIndex>1&&(<Button size="sm" className="flex gap-2 items-center"
           onClick={()=>setActiveFormIndex(activeFormIndex-1)}
          ><ArrowLeft/></Button>)}
          <Button 
            disabled={!enableNext}
            className="flex gap-2" size="sm"
            onClick={()=>setActiveFormIndex(activeFormIndex+1)}
          > Next 
            <ArrowRight/> </Button>
        </div>

      </div>
      {/* Professional Details */}
       {activeFormIndex==1?<PersonalDetail enabledNext={(v)=>setEnableNext(v)} />
        :activeFormIndex==2?
            <Summery enabledNext={(v)=>setEnableNext(v)}/>
            :activeFormIndex==3?
            <Experience/>
            :activeFormIndex == 4?
            <Education/>
            :activeFormIndex == 5?
            <Skills/>
            

        :null 
            
          }




      {/* Educational details  */}

      {/* Skills */}
    </div>
  )
}

export default FormSection