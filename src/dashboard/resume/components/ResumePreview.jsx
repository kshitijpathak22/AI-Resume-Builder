import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext } from 'react';
import PersonalDetailsPreview from './preview/PersonalDetailsPreview';
import SummeryPreview from './preview/SummeryPreview';
import ExperiencePreview from './preview/ExperiencePreview';
import EducationalPreview from './preview/EducationalPreview';
import SkillPreview from './preview/SkillPreview';

function ResumePreview() {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

    return (
        <div className='shadow-lg h-full p-14 boreder-t-[20px]'
        style={{
            borderColor:resumeInfo?.themeColor
        }}
        >

            {/* Personal Details */}
            <PersonalDetailsPreview resumeInfo={resumeInfo} />
            {/* Summary */}
            <SummeryPreview resumeInfo={resumeInfo} />
            {/* Professional Experience */}
            <ExperiencePreview resumeInfo={resumeInfo}/>
            {/* Educational */}
            <EducationalPreview resumeInfo={resumeInfo}/>
            {/* Skills */}
            <SkillPreview resumeInfo={resumeInfo} />
        </div>
    );
}

export default ResumePreview;
