import { Loader2, Plus, UploadCloud } from 'lucide-react'
import React, { useState, useRef } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import GlobalApi from "~/service/GlobalApi.js";
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function AddResume() {
    const [openDialog, setOpenDialog] = useState(false);
    const [resumeTitle, setResumeTitle] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const navigation = useNavigate();
    const fileInputRef = useRef(null);
    const { getToken } = useAuth();

    const onCreate = async () => {
        setLoading(true)
        const uuid = uuidv4();

        try {
            const result = await GlobalApi.CreateNewResume({
                title: resumeTitle,
                resumeId: uuid,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName
            }, await getToken());
            setLoading(false);
            navigation('/dashboard/resume/' + result.id + "/edit");
        } catch (error) {
            console.error("Create error:", error);
            setLoading(false);
        }
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            // 1. Parse Resume with Python AI backend
            const token = await getToken();
            const parseRes = await fetch(`${GlobalApi.API_BASE}/api/resume/parse`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (!parseRes.ok) {
                const errData = await parseRes.json();
                throw new Error(errData.detail || 'Failed to parse resume');
            }

            const parsedData = await parseRes.json();
            
            // 2. Create an empty resume container first
            const uuid = uuidv4();
            const result = await GlobalApi.CreateNewResume({
                title: file.name.split('.')[0] + ' (Parsed)',
                resumeId: uuid,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName
            }, token);

            // 3. Update the newly created resume with the parsed JSON data
            await GlobalApi.UpdateResumeDetail(result.id, parsedData, token);

            toast("Resume parsed successfully!");
            setUploadLoading(false);
            
            // 4. Navigate to editor
            navigation('/dashboard/resume/' + result.id + "/edit");

        } catch (error) {
            console.error("Upload Error:", error);
            toast.error(error.message || "Failed to process resume");
            setUploadLoading(false);
        }
        
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    return (
        <>
            {/* Create New Resume Card */}
            <div className='p-14 py-24 border 
                items-center flex flex-col gap-4
                justify-center card-glass
                rounded-xl h-[280px]
                hover:scale-105 active:scale-[0.97] transition-all hover:shadow-2xl
                cursor-pointer border-dashed border-white/50 dark:border-white/20 group'
                onClick={() => setOpenDialog(true)}
            >
                <div className="icon-glass group-hover:bg-primary/20 transition-all duration-300">
                    <Plus strokeWidth={1.5} className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors text-center">Create Blank</span>
            </div>

            {/* Upload Existing Resume Card */}
            <div className='p-14 py-24 border 
                items-center flex flex-col gap-4
                justify-center card-glass
                rounded-xl h-[280px]
                hover:scale-105 active:scale-[0.97] transition-all hover:shadow-2xl
                cursor-pointer border-dashed border-[#16A6F8]/50 dark:border-[#16A6F8]/20 group relative overflow-hidden'
                onClick={() => !uploadLoading && fileInputRef.current?.click()}
            >
                {uploadLoading ? (
                    <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-12 h-12 text-[#16A6F8] animate-spin" />
                        <span className="text-sm font-medium text-[#16A6F8] animate-pulse text-center">AI is parsing...</span>
                    </div>
                ) : (
                    <>
                        <div className="icon-glass group-hover:bg-[#16A6F8]/20 transition-all duration-300">
                            <UploadCloud strokeWidth={1.5} className="w-12 h-12 text-[#16A6F8] group-hover:scale-110 transition-transform group-hover:-translate-y-1" />
                        </div>
                        <span className="font-semibold text-foreground group-hover:text-[#16A6F8] transition-colors text-center">Upload Resume <br/><span className="text-xs text-muted-foreground font-normal">(PDF or DOCX)</span></span>
                    </>
                )}
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                    onChange={handleFileUpload} 
                />
            </div>

            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Resume</DialogTitle>
                        <DialogDescription>
                            <p>Add a title for your new resume</p>
                            <Input className="my-2"
                                placeholder="Ex.Full Stack resume"
                                onChange={(e) => setResumeTitle(e.target.value)}
                            />
                        </DialogDescription>
                        <div className='flex justify-end gap-5'>
                            <Button onClick={() => setOpenDialog(false)} variant="ghost">Cancel</Button>
                            <Button
                                disabled={!resumeTitle || loading}
                                onClick={() => onCreate()}>
                                {loading ?
                                    <Loader2 className='animate-spin' /> : 'Create'
                                }
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddResume