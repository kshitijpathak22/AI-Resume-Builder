import React, { useContext, useState } from 'react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Button } from '@/components/ui/button';
import { Save, LoaderCircle } from 'lucide-react';
import GlobalApi from '~/service/GlobalApi';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnStrikeThrough, Separator, BtnNumberedList, BtnBulletList, BtnLink, BtnStyles } from 'react-simple-wysiwyg';

function FreeformEditor() {
    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext);
    const {resumeId} = useParams();
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    
    const onSave = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            await GlobalApi.UpdateResumeDetail(resumeId, { content: resumeInfo?.content }, token);
            toast.success("Resume updated!");
        } catch(e) {
            toast.error("Failed to save resume");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center shadow-sm p-4 rounded-lg bg-card">
                <h2 className="font-bold text-lg">Freeform Resume Editor</h2>
                <Button onClick={onSave} disabled={loading} size="sm">
                    {loading ? <LoaderCircle className="animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save</>}
                </Button>
            </div>
            
            <div className="bg-card p-4 rounded-lg border shadow-sm">
                <EditorProvider>
                    <Editor 
                        value={resumeInfo?.content || ''} 
                        onChange={(e) => setResumeInfo({...resumeInfo, content: e.target.value})}
                        containerProps={{ style: { height: '600px', overflowY: 'auto' } }}
                    >
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
                            <BtnStyles />
                        </Toolbar>
                    </Editor>
                </EditorProvider>
            </div>
        </div>
    )
}

export default FreeformEditor;
