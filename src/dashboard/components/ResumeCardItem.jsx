import { Notebook } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

function ResumeCardItem({resume}) {
  return (
    <div className=''>
          <Link to={'/dashboard/resume/'+resume.documentId+"/edit"}>
        <div className='p-14  bg-gradient-to-b
          from-pink-100 via-purple-200 to-blue-200
        h-[280px] 
          rounded-t-lg border-t-4
        '
        style={{
          borderColor:resume?.themeColor
        }}
        >
              <div className='flex 
        items-center justify-center h-[180px] '>
                {/* <Notebook/> */}
                <img src="/cv.png" width={80} height={80} />
              </div>
        </div>
        </Link>
    </div>
  )
}

export default ResumeCardItem