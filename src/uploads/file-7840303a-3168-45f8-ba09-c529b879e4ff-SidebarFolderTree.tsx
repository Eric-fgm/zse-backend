import React from "react";
import SlideWrapper from "@/lib/Slide/SlideWrapper";
import SidebarFolder from "@/components/molecules/SidebarFolder";
import SidebarFolderNode, {
  ISidebarFolderNodeProps,
} from "@/components/molecules/SidebarFolderNode";
import { focusNextElement, focusPreviousElement } from "@/utils";

export interface ISidebarFolderTreeProps {
  id: string;
  href: string;
  text: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  nestedFolders: ISidebarFolderNodeProps[];
}

const SidebarFolderTree: React.FC<ISidebarFolderTreeProps> = ({
  nestedFolders,
  ...props
}) => {
  const handleFocus = (
    { currentTarget }: React.FocusEvent<HTMLSpanElement>,
    expand: (flag?: boolean) => void
  ) => {
    const handleKeyDown = ({ keyCode }: any) => {
      switch (keyCode) {
        case 37:
        case 39:
          expand();
          break;
        case 38:
          focusPreviousElement(currentTarget);
          break;
        case 40:
          focusNextElement(currentTarget);
          break;
      }
    };
    currentTarget.addEventListener("keydown", handleKeyDown);
    currentTarget.addEventListener(
      "blur",
      () => {
        currentTarget.removeEventListener("keydown", handleKeyDown);
      },
      { once: true }
    );
  };

  return (
    <SlideWrapper>
      <SidebarFolder onFocus={handleFocus} {...props} />
      <div>
        {nestedFolders.map((nodeProps) => (
          <SidebarFolderNode
            key={nodeProps.id}
            path={[props.id]}
            {...nodeProps}
          />
        ))}
      </div>
    </SlideWrapper>
  );
};

export default SidebarFolderTree;
