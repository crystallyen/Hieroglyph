import DocumentCard from './DocsCard';

export default function DocsCardGrid({Documents,handleDelete,handleRename}) {
return (
  <div className="flex flex-wrap gap-x-10 gap-y-7 justify-start ml-40 mr-10 mt-25">
    {Documents.length > 0 ? Documents.map((doc) => (
      <DocumentCard 
        key={doc.id} 
        title={doc.title} 
        timestamp={doc.timestamp} 
        onDelete={() => handleDelete(doc.id)}
        onRename={() => handleRename(doc.id, newTitle)}
        isNew={doc.isNew}
      />  
    )) : (
      <div className="flex justify-center items-center mt-38 ml-80 text-2xl">Create a new document!</div>
    )}
  </div>
);
}
