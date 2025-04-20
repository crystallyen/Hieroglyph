import DocumentCard from './DocumentCard';
import { useNavigate } from 'react-router-dom';

export default function DocsCardGrid({ documents,handleDelete,handleRename}) {
  console.log(documents);
  const navigate = useNavigate();
  function formatLastModified(isoString) {
    const now = new Date();
    const updatedAt = new Date(isoString);
    const diffMs = now - updatedAt;
  
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
  
    if (diffSecs < 60) {
      return `Last modified just now`;
    } else if (diffMins < 60) {
      return `Last modified ${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    } else if (diffHours < 24) {
      return `Last modified ${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays === 1) {
      return `Last modified yesterday`;
    } else if (diffDays < 7) {
      return `Last modified ${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else if (diffWeeks < 5) {
      return `Last modified ${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
    } else if (diffMonths < 12) {
      return `Last modified ${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
    } else {
      return `Last modified ${diffYears} year${diffYears === 1 ? '' : 's'} ago`;
    }
  }
  
return (
  <div className="flex flex-wrap gap-x-10 gap-y-7 justify-start ml-40 mr-10 mt-25">
    {documents.length > 0 ? documents.map((doc) => (
      <DocumentCard 
        documentId={doc.document_id} 
        title={doc.title} 
        timestamp={formatLastModified(doc.updated_at)} 
        onDelete={() => handleDelete(doc.document_id)}
        onRename={(documentId,newTitle) => handleRename(documentId, newTitle)}
        onClick = {() => navigate(`/doc/${doc.document_id}`)}
      />  
    )) : (
      <div className="flex justify-center items-center text-2xl">Create a new document!</div>
    )}
  </div>
);
}
