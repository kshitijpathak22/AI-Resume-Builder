import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import React, { useContext, useState } from 'react'
import { BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic, BtnLink, BtnNumberedList, BtnRedo, BtnStrikeThrough, BtnStyles, BtnUnderline, BtnUndo, Editor, EditorProvider, HtmlButton, Separator, Toolbar } from 'react-simple-wysiwyg';
import { toast } from 'sonner';
import { sendMessageWithExamples } from '~/service/AIModal.js';

const PROMPT='position titile: {positionTitle} , Depends on position title give me 5-7 bullet points for my experience in resume (Please do not add experince level and No JSON array) , give me result in HTML tags'


function RichTextEditor({onRichTextEditorChange,index,defaultValue}) {
  const [value,setValue]=useState(defaultValue);
  const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext)
  const [loading,setLoading]=useState(false);
  const GenerateSummeryFromAI=async()=>{
   
    if(!resumeInfo?.Experience[index]?.title)
    {
      toast('Please Add Position Title');
      return ;
    }
    setLoading(true)
    
    try {
      const prompt=PROMPT.replace('{positionTitle}',resumeInfo.Experience[index].title);
      
      console.log(`Generating AI content for job ${index + 1}: ${resumeInfo.Experience[index].title}`);
      
      // Use the enhanced function with examples
      const result = await sendMessageWithExamples(prompt, 'experience');
      console.log(`AI Response for job ${index + 1}:`, result.response.text());
      const resp=result.response.text()
      
      // Clean up the response and validate it
      if (resp && resp.trim()) {
        const cleanedResp = resp.replace('[','').replace(']','').trim();
        setValue(cleanedResp);
        toast.success(`AI content generated successfully for ${resumeInfo.Experience[index].title}!`);
      } else {
        toast.error("AI returned empty response. Please try again.");
      }
    } catch (error) {
      console.error(`Error generating AI content for job ${index + 1}:`, error);
      
      // Provide specific error messages
      if (error.message?.includes('quota')) {
        toast.error("AI service quota exceeded. Please try again later.");
      } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error("Failed to generate AI content. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
  <div>
    <div className='flex justify-between my-2'>
      <label className='text-xs'>Summery</label>
      <Button variant="outline" size="sm" 
      onClick={GenerateSummeryFromAI}
      disabled={loading}
      className="flex gap-2 border-primary text-primary">
        {loading?
        <LoaderCircle className='animate-spin'/>:  
        <>
         <Brain className='h-4 w-4'/> Generate from AI 
         </>
      }
       </Button>
    </div>
  <EditorProvider>
    <Editor value={value} onChange={(e)=>{
      setValue(e.target.value);
      onRichTextEditorChange(e)
    }}>
       <Toolbar>
        <BtnBold />
        <BtnItalic />
        <BtnUnderline />
        <BtnStrikeThrough />
        <Separator />
        <BtnNumberedList />
        <BtnBulletList />
        <Separator />
        <BtnLink />
       
       
      </Toolbar>
    </Editor>
    </EditorProvider>
  </div>
)
}

export default RichTextEditor