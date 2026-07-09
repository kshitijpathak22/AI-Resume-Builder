import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext, useState } from 'react';
import PersonalDetailsPreview from './preview/PersonalDetailsPreview';
import SummeryPreview from './preview/SummeryPreview';
import ExperiencePreview from './preview/ExperiencePreview';
import EducationalPreview from './preview/EducationalPreview';
import SkillPreview from './preview/SkillPreview';
import ResumePreviewModern from './ResumePreviewModern';

function ResumePreview() {

    const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext)
    const [template, setTemplate] = useState('classic');

  return (
    <div>
        {/* Template Selector */}
        <div className='flex gap-2 mb-4 justify-center'>
            <button
                onClick={() => setTemplate('classic')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${template === 'classic' ? 'bg-primary text-white border-primary shadow-md' : 'bg-background text-foreground border-border hover:bg-muted'}`}
            >
                Classic
            </button>
            <button
                onClick={() => setTemplate('modern')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${template === 'modern' ? 'bg-primary text-white border-primary shadow-md' : 'bg-background text-foreground border-border hover:bg-muted'}`}
            >
                Modern
            </button>
        </div>

        {template === 'classic' ? (
            <div className='shadow-lg h-full p-14 border-t-[20px] bg-white text-black'
            style={{
                borderColor:resumeInfo?.themeColor
            }}>
                {/* Personal Detail  */}
                    <PersonalDetailsPreview resumeInfo={resumeInfo} />
                {/* Summary  */}
                    <SummeryPreview resumeInfo={resumeInfo} />
                {/* Professional Experience  */}
                {resumeInfo?.Experience?.length>0&& <ExperiencePreview resumeInfo={resumeInfo} />}
                {/* Educational  */}
                {resumeInfo?.education?.length>0&&   <EducationalPreview resumeInfo={resumeInfo} />}
                {/* Skills  */}
                {resumeInfo?.skills?.length>0&&    <SkillPreview resumeInfo={resumeInfo}/>}
            </div>
        ) : (
            <ResumePreviewModern resumeInfo={resumeInfo} />
        )}
    </div>
  )
}

export default ResumePreview