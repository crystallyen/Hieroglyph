import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import axios from "@/config/axiosConfig.js";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";

const Menu = ({ saveDocument, editor }) => {
    const navigate = useNavigate();

    const handleAddDocument = async () => {
        await axios.post("/api/documents/create")
            .then((res) => {
                const documentId = res.data.document[0].document_id;
                toast.success("Created document");
                navigate(`/doc/${documentId}`);
            })
            .catch(error => {
                toast.error("Error creating document");
            });
    };

    const handleCut = () => {
        if (!editor) return;

        const { state } = editor;
        const { from, to, empty } = state.selection;

        if (empty) return;

        const selectedText = editor.state.doc.textBetween(from, to, " ");

        navigator.clipboard.writeText(selectedText).then(() => {
            editor.chain().focus().deleteSelection().run();
        }).catch(err => {
            toast.error("Failed to cut to clipboard");
        });
    };

    const handleCopy = () => {
        if (!editor) return;

        const { state } = editor;
        const { from, to, empty } = state.selection;

        if (empty) return;

        const selectedText = editor.state.doc.textBetween(from, to, " ");

        navigator.clipboard.writeText(selectedText).catch(err => {
            toast.error("Failed to copy to clipboard");
        });
    };

    const handlePaste = async () => {
        if (!editor) return;

        try {
            const text = await navigator.clipboard.readText();
            editor.chain().focus().insertContent(text).run();
        } catch (err) {
            toast.error("Failed to paste from clipboard");
        }
    };

    const printDocument = () => {
        const html = editor.getHTML();

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
        <html>
            <head>
                <title>Print Document</title>
                <style>
                    @media print {
                        body {
                            line-height: 1;
                            margin: 0;
                            padding: 0;
                        }
                        h1, h2, h3, h4, h5, h6 {
                            page-break-after: avoid;
                        }
                        p {
                            orphans: 3;
                            widows: 3;
                        }
                        .page-break {
                            page-break-before: always;
                        }
                    }
                    body {
                        color: #000;
                        line-height: 1;
                    }
                </style>
            </head>
            <body onload="window.print(); window.close();">
                ${html}
            </body>
        </html>
    `);

        printWindow.document.close();
    };

    const handleFullScreen = () => {
        const el = document.documentElement;

        if (!document.fullscreenElement) {
            el.requestFullscreen().catch((err) => console.error(err));
        } else {
            document.exitFullscreen();
        }
    };


    return (
      <Menubar>
          <MenubarMenu>
              <MenubarTrigger className="w-full">File</MenubarTrigger>
              <MenubarContent>
                  <MenubarItem onClick={handleAddDocument}>
                      New Document <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  {/*<MenubarItem>*/}
                  {/*    Open <MenubarShortcut>⌘O</MenubarShortcut>*/}
                  {/*</MenubarItem>*/}
                  <MenubarItem onClick={saveDocument}>
                      Save <MenubarShortcut>⌘S</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  {/*<MenubarSub>*/}
                  {/*    <MenubarSubTrigger>Export</MenubarSubTrigger>*/}
                  {/*    <MenubarSubContent>*/}
                  {/*        <MenubarItem>PDF</MenubarItem>*/}
                  {/*        <MenubarItem>DOCX</MenubarItem>*/}
                  {/*        <MenubarItem>HTML</MenubarItem>*/}
                  {/*    </MenubarSubContent>*/}
                  {/*</MenubarSub>*/}
                  {/*<MenubarSeparator />*/}
                  <MenubarItem onClick={printDocument}>
                      Print... <MenubarShortcut>⌘P</MenubarShortcut>
                  </MenubarItem>
              </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
              <MenubarTrigger className="w-full">Edit</MenubarTrigger>
              <MenubarContent>
                  <MenubarItem onClick={() => editor.commands.undo()}>
                      Undo <MenubarShortcut>⇧Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={() => editor.commands.redo()}>
                      Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem className="text-center" onClick={handleCut}>Cut</MenubarItem>
                      <MenubarItem className="text-center" onClick={handleCopy}>Copy</MenubarItem>
                  <MenubarItem className="text-center" onClick={handlePaste}>Paste</MenubarItem>
              </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
              <MenubarTrigger className="w-full">View</MenubarTrigger>
              <MenubarContent>
                  <MenubarItem inset onClick={() => window.location.reload()}>
                      Reload <MenubarShortcut>⌘R</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem inset onClick={handleFullScreen}>Toggle Fullscreen</MenubarItem>
              </MenubarContent>
          </MenubarMenu>
      </Menubar>
  );
};

export default Menu;