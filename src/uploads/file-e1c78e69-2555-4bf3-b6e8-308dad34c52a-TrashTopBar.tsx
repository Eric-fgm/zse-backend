import React from "react";
import { useRouter } from "next/router";
import { HeadlineMedium } from "../atoms/Headlines";
import Wrapper from "../atoms/Wrapper";
import TrashTopBarTools from "../molecules/TrashTopBarTools";

export interface ITrashTopBarProps {}

const TrashTopBar: React.FC<ITrashTopBarProps> = (props) => {
  const { query } = useRouter();
  return (
    <div className="py-4 bg-white shadow-elevation-y z-20">
      <Wrapper className="flex items-center justify-between">
        <div>
          <HeadlineMedium>Trash on My drive</HeadlineMedium>
          {/* <SubHeadRegular className="mt-1 mr-4 flex-shrink-0">
            All results – 32
          </SubHeadRegular> */}
        </div>
        <TrashTopBarTools />
      </Wrapper>
    </div>
  );
};

export default TrashTopBar;
