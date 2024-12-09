import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import React, { useContext, useState } from 'react'
import { BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic, BtnLink, BtnNumberedList, BtnRedo, BtnStrikeThrough, BtnStyles, BtnUnderline, BtnUndo, Editor, EditorProvider, HtmlButton, Separator, Toolbar } from 'react-simple-wysiwyg';
import { toast } from 'sonner';
import { AIChatSession } from '~/service/AIModal.js';


const PROMPT = 'position title: {positionTitle}, Based on the position title, provide 5-7 bullet points for my experience in resume. Return the result in HTML format.';
function RichTextEditor({onRichTextEditorChange, index}) {
    const  [value, setValue] = useState();
    const {resumeInfo, setResumeInfo}=useContext(ResumeInfoContext);
    const [loading, setLoading] = useState(false);

    const GenerateSummeryFromAI = async () => {
        try {
          // Validate the Experience array and title
          if (!resumeInfo?.experience || !resumeInfo.experience[index]) {
            toast.error('Please add an experience entry before generating a summary.');
            return;
          }
      
          if (!resumeInfo.experience[index]?.title) {
            toast.error('Please add a position title.');
            return;
          }
      
          setLoading(true);
      
          // Replace the placeholder in the prompt with the actual position title
          const prompt = PROMPT.replace('{positionTitle}', resumeInfo.experience[index].title);
      
          // Send the request to AIChatSession
          const result = await AIChatSession.sendMessage(prompt);
      
          // Await and process the response text
          const rawResponse = await result.response.text();
          console.log('Raw AI Response:', rawResponse);
      
          let parsedBulletPoints = '';
      
          try {
            // Parse the JSON
            const parsedJson = JSON.parse(rawResponse);
            
            // Check for bulletPoints array
            if (parsedJson.bulletPoints && Array.isArray(parsedJson.bulletPoints)) {
              // Convert to HTML list
              parsedBulletPoints = `<ul>${parsedJson.bulletPoints
                .map(point => `<li>${point}</li>`)
                .join('')}</ul>`;
            }
          } catch (error) {
            console.error('Error parsing JSON:', error);
            // Fallback to raw response if parsing fails
            parsedBulletPoints = rawResponse;
          }
      
          // If no parsed content, use raw response
          if (!parsedBulletPoints) {
            parsedBulletPoints = rawResponse;
          }
      
          // Update the editor state with the parsed response
          setValue(parsedBulletPoints);
          onRichTextEditorChange({ target: { value: parsedBulletPoints } });
      
          // Update the context with the new summary
          setResumeInfo((prev) => {
            const updatedExperience = [...prev.experience];
            updatedExperience[index].workSummary = parsedBulletPoints;
            return { ...prev, experience: updatedExperience };
          });
      
          toast.success('Summary generated successfully!');
          setLoading(false);
        } catch (error) {
          console.error('Error generating summary:', error);
          toast.error('Failed to generate summary. Please try again.');
          setLoading(false);
        }
      };
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