import AccountMenu from './AccountMenu'
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DocumentCardGrid from "./DocumentCardGrid";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { ArrowDownUp } from "lucide-react";
import axios from "@/config/axiosConfig";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const[documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getDocuments = async () => {
      await axios.get('/api/documents')
        .then((res) => {
          setDocuments(res.data.documents)
        })
        .catch(error => {
          console.log(error);
        });
    };
    getDocuments();
  }, []);

  const handleAddDocument = async () => {
    console.log("Add new doc");
    
    await axios.post("/api/documents/create")
    .then((res) => {
      const documentId = res.data.document[0].document_id; 
      navigate(`/doc/${documentId}`); 
    })
    .catch(error => {
      // Toast here
    });
  };

  const handleRenameDocument = async (documentId, newTitle) => {
    await axios.put(`/api/documents/${documentId}/rename`, { title: newTitle })
      .then((res) => {
        setDocuments(documents.map(doc => doc.document_id === documentId ? { ...doc, title: newTitle } : doc));
      })
      .catch(error => {
        // Handle error
      });
  }

  const handleDeleteDocument = async (documentId) => { 
    await axios.delete(`/api/documents/${documentId}`)
      .then((res) => {
        setDocuments(documents.filter(doc => doc.document_id !== documentId));
      })
      .catch(error => {
        // Handle error
      });
  }
  
  const handleSortByTitle = () => {
    setDocuments((prev) => {
      const sorted = [...prev].sort((a, b) => a.title.localeCompare(b.title));
      return sorted;
    });
  };
  return (
    <>
    <div className="w-full flex justify-end p-5">
      <AccountMenu />
    </div>
   
  <div className="container mx-auto p-4 pt-2">
    {/* Top Bar */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold ml-2">My Documents</h2>

      <div className="flex items-center gap-4">
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <ArrowDownUp />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-36">
            <DropdownMenuItem>
              <span>Last Modified</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSortByTitle}>
              <span>Title</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* New Document Button */}
        <Button variant="secondary" onClick={handleAddDocument}>
          New Document
        </Button>
      </div>
    </div>

    {/* Document Grid */}
    <DocumentCardGrid
      documents={documents}
      handleDelete={handleDeleteDocument}
      handleRename={handleRenameDocument}
    />
  </div>
</>
  )
}

export default Dashboard;