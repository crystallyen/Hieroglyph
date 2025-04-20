import DocumentCard from './DocumentCard';
import { useNavigate } from 'react-router-dom';

export default function DocsCardGrid({ documents,handleDelete,handleRename}) {
  console.log(documents);
  const navigate = useNavigate();
  
return (
  <div className="flex flex-wrap gap-x-10 gap-y-7 justify-start ml-40 mr-10 mt-25">
    {documents.length > 0 ? documents.map((doc) => (
      <DocumentCard 
        documentId={doc.document_id} 
        title={doc.title} 
        timestamp={doc.timestamp} 
        onDelete={() => handleDelete(doc.document_id)}
        onRename={() => handleRename(doc.document_id, newTitle)}
        onClick = {() => navigate(`/doc/${doc.document_id}`)}
      />  
    )) : (
      <div className="flex justify-center items-center text-2xl">Create a new document!</div>
    )}
  </div>
);
}
