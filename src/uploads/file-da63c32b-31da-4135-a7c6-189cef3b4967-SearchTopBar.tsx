import { useRouter } from "next/router";
import React from "react";
import { HeadlineMedium } from "../atoms/Headlines";
import { SubHeadRegular } from "../atoms/SubHeads";
import Wrapper from "../atoms/Wrapper";
import HomeTopBarTools from "../molecules/HomeTopBarTools";

export interface ISearchTopBarProps {}

const SearchTopBar: React.FC<ISearchTopBarProps> = (props) => {
  const { query } = useRouter();
  return (
    <div className="py-4 bg-white shadow-elevation-y z-20">
      <Wrapper className="flex items-end justify-between">
        <div>
          <HeadlineMedium>Search result: {query.q}</HeadlineMedium>
          <SubHeadRegular className="mt-1 mr-4 flex-shrink-0">
            All results – 32
          </SubHeadRegular>
        </div>
        <HomeTopBarTools />
      </Wrapper>
    </div>
  );
};

export default SearchTopBar;
