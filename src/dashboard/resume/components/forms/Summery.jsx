import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { Brain, LoaderCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import { Form, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { sendMessageWithExamples } from "~/service/AIModal.js";
import GlobalApi from "~/service/GlobalApi.js";

const prompt = "Job Title: {jobTitle}, Depends on job title give me list of summery for 3 experience levels: Fresher, Mid Level, Experienced. Provide 3-4 lines in array format with fields: summary and experience_level.";

function Summery({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summery, setSummery] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const [aiGeneratedSummeryList, setAiGeneratedSummeryList] = useState([]);

  

  useEffect(() => {
    if (summery) {
      setResumeInfo({
        ...resumeInfo,
        summery: summery,
      });
    }
  }, [summery]);

  const GenerateSummeryFromAI = async () => {
    setLoading(true);
    const PROMPT = prompt.replace('{jobTitle}', resumeInfo?.jobTitle);
    console.log("Generated Prompt:", PROMPT);
  
    try {
      // Use the enhanced function with examples
      const result = await sendMessageWithExamples(PROMPT, 'summary');
      console.log("AI Response:", result.response.text());
  
      // Try to parse the response as JSON
      let aiResponse;
      try {
        aiResponse = JSON.parse(result.response.text());
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        toast.error("AI response format error. Please try again.");
        return;
      }

      // Validate the response structure
      if (aiResponse?.summaries && Array.isArray(aiResponse.summaries)) {
        setAiGeneratedSummeryList(
          aiResponse.summaries.map((summaryItem) => ({
            ...summaryItem,
            summary: Array.isArray(summaryItem.summary) ? summaryItem.summary[0] : summaryItem.summary
          }))
        );
        toast.success("AI suggestions generated successfully!");
      } else {
        console.error("AI response is not in the expected format:", aiResponse);
        toast.error("AI response format is unexpected. Please try again.");
      }
    } catch (error) {
      console.error("Error generating summary from AI:", error);
      
      // Provide specific error messages based on error type
      if (error.message?.includes('quota')) {
        toast.error("AI service quota exceeded. Please try again later.");
      } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error("Failed to generate AI suggestions. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);
  
    const data = {
      data: {
        summery: summery || ''  // Ensure non-null value
      }
    };
  
    GlobalApi.UpdateResumeDetail(params.resumeId, data)
      .then(resp => {
        enabledNext(true);
        toast.success('Details updated successfully');
      })
      .catch(error => {
        console.error('Error details:', error.response?.data);
        toast.error(error.response?.data?.error?.message || 'Update failed');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add Summary for your job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label>Add Summary</label>
            <Button
              variant="outline"
              onClick={GenerateSummeryFromAI}
              type="button"
              size="sm"
              className="border-primary text-primary flex gap-2"
            >
              <Brain className="h-4 w-4" /> Generate from AI
            </Button>
          </div>
          <Textarea
            className="mt-5"
            required
            value={summery}
            defaultValue={resumeInfo?.summery}
            onChange={(e) => setSummery(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummeryList && (
  <div className="my-5">
    <h2 className="font-bold text-lg">Suggestions</h2>
    {aiGeneratedSummeryList.map((item, index) => (
  <div
    key={index}
    onClick={() => setSummery(item?.summary)}
    className="p-5 shadow-lg my-4 rounded-lg cursor-pointer"
  >
    <h2 className="font-bold my-1 text-primary">
      Level: {item?.experience_level}
    </h2>
    <p>{item?.summary}</p>
  </div>
))}

  </div>
)}

    </div>
  );
}

export default Summery;