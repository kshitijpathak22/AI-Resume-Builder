import React from 'react';

function ResumePreviewModern({ resumeInfo }) {
  if (!resumeInfo) return null;

  const themeColor = resumeInfo?.themeColor || '#5B3FD9';

  return (
    <div className='shadow-lg h-full bg-white text-black flex' style={{ minHeight: '100%' }}>
      {/* Left Sidebar */}
      <div className='w-[35%] p-6 text-white' style={{ backgroundColor: themeColor }}>
        {/* Name & Title */}
        <div className='mb-8'>
          <h1 className='text-xl font-bold leading-tight'>
            {resumeInfo?.firstName} {resumeInfo?.lastName}
          </h1>
          <p className='text-sm mt-1 opacity-90'>{resumeInfo?.jobTitle}</p>
        </div>

        {/* Contact Info */}
        <div className='mb-8'>
          <h3 className='text-xs font-bold uppercase tracking-widest mb-3 opacity-80 border-b border-white/30 pb-1'>Contact</h3>
          <div className='space-y-2 text-xs'>
            {resumeInfo?.email && (
              <div>
                <span className='opacity-70'>Email</span>
                <p className='break-all'>{resumeInfo.email}</p>
              </div>
            )}
            {resumeInfo?.phone && (
              <div>
                <span className='opacity-70'>Phone</span>
                <p>{resumeInfo.phone}</p>
              </div>
            )}
            {resumeInfo?.address && (
              <div>
                <span className='opacity-70'>Address</span>
                <p>{resumeInfo.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {resumeInfo?.skills?.length > 0 && (
          <div>
            <h3 className='text-xs font-bold uppercase tracking-widest mb-3 opacity-80 border-b border-white/30 pb-1'>Skills</h3>
            <div className='space-y-2'>
              {resumeInfo.skills.map((skill, index) => (
                <div key={index}>
                  <p className='text-xs mb-1'>{skill.name}</p>
                  <div className='h-1.5 bg-white/20 rounded-full'>
                    <div
                      className='h-1.5 bg-white rounded-full'
                      style={{ width: `${skill?.rating * 20}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Main Content */}
      <div className='w-[65%] p-6'>
        {/* Summary */}
        {resumeInfo?.summary && (
          <div className='mb-6'>
            <h3 className='text-sm font-bold uppercase tracking-widest mb-2' style={{ color: themeColor }}>Professional Summary</h3>
            <hr style={{ borderColor: themeColor }} className='mb-2' />
            <p className='text-xs leading-relaxed text-gray-700'>{resumeInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resumeInfo?.Experience?.length > 0 && (
          <div className='mb-6'>
            <h3 className='text-sm font-bold uppercase tracking-widest mb-2' style={{ color: themeColor }}>Professional Experience</h3>
            <hr style={{ borderColor: themeColor }} className='mb-2' />
            {resumeInfo.Experience.map((exp, index) => (
              <div key={index} className='mb-4'>
                <h4 className='text-sm font-bold' style={{ color: themeColor }}>{exp?.title}</h4>
                <div className='flex justify-between text-xs text-gray-500'>
                  <span>{exp?.companyName}{exp?.city ? `, ${exp.city}` : ''}{exp?.state ? `, ${exp.state}` : ''}</span>
                  <span>{exp?.startDate} — {exp?.currentlyWorking ? 'Present' : exp?.endDate}</span>
                </div>
                <div className='text-xs my-1 text-gray-700' dangerouslySetInnerHTML={{ __html: exp?.workSummary }} />
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {resumeInfo?.education?.length > 0 && (
          <div className='mb-6'>
            <h3 className='text-sm font-bold uppercase tracking-widest mb-2' style={{ color: themeColor }}>Education</h3>
            <hr style={{ borderColor: themeColor }} className='mb-2' />
            {resumeInfo.education.map((edu, index) => (
              <div key={index} className='mb-3'>
                <h4 className='text-sm font-bold' style={{ color: themeColor }}>{edu?.universityName}</h4>
                <div className='flex justify-between text-xs text-gray-500'>
                  <span>{edu?.degree} in {edu?.major}</span>
                  <span>{edu?.startDate} - {edu?.endDate}</span>
                </div>
                {edu?.description && <p className='text-xs mt-1 text-gray-700'>{edu.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumePreviewModern;
