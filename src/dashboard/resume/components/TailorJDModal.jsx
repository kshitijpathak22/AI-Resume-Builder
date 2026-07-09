import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Wand2, Loader2, Sparkles } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'

function TailorJDModal() {
    const [open, setOpen] = useState(false)
    const [jdText, setJdText] = useState('')
    const [loading, setLoading] = useState(false)

    const handleTailor = async () => {
        if(!jdText.trim()) return;
        setLoading(true)
        
        // Mock backend processing delay for frontend demonstration
        setTimeout(() => {
            setLoading(false)
            setOpen(false)
            setJdText('')
            // Note: Full cloning and Gemini logic will be implemented here
            // It will call GlobalApi to duplicate the resume, then call Gemini to rewrite, then navigate to new resume ID.
        }, 3000)
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2 border-primary/20 hover:border-primary/50 dark:hover:border-sky-500 hover:text-sky-500 transition-colors shadow-sm">
            <Wand2 className="w-4 h-4" />
            Tailor to JD
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-sky-400" />
            Tailor Resume to Job
          </DialogTitle>
          <DialogDescription className="text-md mt-2">
            Paste the Job Description below. Our AI will duplicate your current resume and rewrite your summary, experience, and skills to highlight keywords from the JD.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4">
            <Textarea 
                placeholder="Paste the target Job Description here..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                className="min-h-[250px] resize-none bg-card/10 border-border/50 focus-visible:ring-sky-500/50 text-md"
            />
        </div>

        <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
            </Button>
            <Button 
                onClick={handleTailor} 
                disabled={!jdText.trim() || loading}
                className="bg-sky-500 hover:bg-sky-600 text-white shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all"
            >
                {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing & Tailoring...</>
                ) : (
                    <><Wand2 className="w-4 h-4 mr-2" /> Tailor Resume</>
                )}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TailorJDModal
