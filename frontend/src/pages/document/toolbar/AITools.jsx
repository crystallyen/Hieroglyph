import { Button } from "@/components/ui/button";
import { Minimize2, TableOfContents, Hammer, NotebookPen } from 'lucide-react';

const AITools = () => {
  return (
    <>
      <Button variant="secondary" className="my-1 w-[100%]"><Minimize2 /> Summarize</Button>
      <Button variant="secondary" className="my-1 w-[100%]"><TableOfContents /> Bulletify</Button>
      <Button variant="secondary" className="my-1 w-[100%]"><NotebookPen /> Paraphrase</Button>
      <Button variant="secondary" className="my-1 w-[100%]"><Hammer /> Proofread</Button>
    </>
  )
}

export default AITools;