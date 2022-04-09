import React from "react";
import DroppableSidebarItem, {
  IDroppableSidebarItemProps,
} from "@/components/molecules/DroppableSidebarItem";
import SidebarLogo from "@/components/molecules/SidebarLogo";
import UploadButton from "@/components/molecules/UploadButton";
import SidebarItem, {
  ISidebarItemProps,
} from "@/components/molecules/SidebarItem";
import Spacer from "@/components/atoms/Spacer";
import LightRecent from "@/icons/LightRecent";
import LightStar from "@/icons/LightStar";
import LightTrash from "@/icons/LightTrash";
import SidebarStorageItem from "@/components/molecules/SidebarStorageItem";
import SidebarFolderTree from "@/components/organisms/SidebarFolderTree";
import Scroller from "@/components/atoms/Scroller";
import { sidebarGlobalDrive, sidebarMyDrive } from "@/utils/statics";
import useDialogController from "@/hooks/useDialogController";
import AssetsListDialog from "@/dialogs/AssetsListDialog";

export interface ISidebarProps {}

interface ISidebarSectionItemProps extends ISidebarItemProps {
  id?: string;
  isDropable?: boolean;
}

const sidebarStatic: ISidebarSectionItemProps[] = [
  {
    href: "/drive/recent",
    text: "Recent",
    Icon: LightRecent,
  },
  {
    id: "starred",
    href: "/drive/starred",
    text: "Starred",
    Icon: LightStar,
    isDropable: true,
  },
  {
    id: "trash",
    href: "/drive/trash",
    text: "Trash",
    Icon: LightTrash,
    isDropable: true,
  },
];

const Sidebar: React.FC<ISidebarProps> = (props) => {
  const { triggerRef, isDialogOpened, toggleDialog, setDialogState } =
    useDialogController();

  console.log(isDialogOpened);

  return (
    <aside className="relative flex flex-col flex-shrink-0 items-start w-64 h-full bg-white shadow-elevation-x z-30">
      <SidebarLogo />
      <UploadButton refObject={triggerRef} text="Nowy" onClick={toggleDialog} />
      <Scroller thin>
        <div className="flex flex-col w-full">
          <SidebarFolderTree {...sidebarGlobalDrive} />
          <SidebarFolderTree {...sidebarMyDrive} />
        </div>
        <div className="flex flex-col w-full">
          {sidebarStatic.map(({ isDropable, ...itemProps }, index) =>
            isDropable ? (
              <DroppableSidebarItem
                key={index}
                {...(itemProps as IDroppableSidebarItemProps)}
              />
            ) : (
              <SidebarItem key={index} {...itemProps} />
            )
          )}
        </div>
        <Spacer />
        <SidebarStorageItem />
      </Scroller>
      <AssetsListDialog
        trigger={triggerRef}
        isOpened={isDialogOpened}
        setOpened={setDialogState}
      />
    </aside>
  );
};

export default Sidebar;
