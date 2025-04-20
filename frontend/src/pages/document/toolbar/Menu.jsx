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

const Menu = () => {
  return (
      <Menubar>
          <MenubarMenu>
              <MenubarTrigger className="w-full">File</MenubarTrigger>
              <MenubarContent>
                  <MenubarItem>
                      New Document <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                      Open <MenubarShortcut>⌘O</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                      Save <MenubarShortcut>⌘S</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarSub>
                      <MenubarSubTrigger>Export</MenubarSubTrigger>
                      <MenubarSubContent>
                          <MenubarItem>PDF</MenubarItem>
                          <MenubarItem>DOCX</MenubarItem>
                          <MenubarItem>HTML</MenubarItem>
                      </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />
                  <MenubarItem>
                      Print... <MenubarShortcut>⌘P</MenubarShortcut>
                  </MenubarItem>
              </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
              <MenubarTrigger className="w-full">Edit</MenubarTrigger>
              <MenubarContent>
                  <MenubarItem>
                      Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem className="text-center">Cut</MenubarItem>
                  <MenubarItem className="text-center">Copy</MenubarItem>
                  <MenubarItem className="text-center">Paste</MenubarItem>
              </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
              <MenubarTrigger className="w-full">View</MenubarTrigger>
              <MenubarContent>
                  <MenubarItem inset>
                      Reload <MenubarShortcut>⌘R</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem inset>Toggle Fullscreen</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem inset>Hide Sidebar</MenubarItem>
              </MenubarContent>
          </MenubarMenu>
      </Menubar>
  );
};

export default Menu;