import React from "react";
import SearchResultHint from "@/components/molecules/SearchResultHint";
import Spacer from "@/components/atoms/Spacer";
import Scroller from "@/components/atoms/Scroller";
import ShowMoreSubHead from "@/components/molecules/ShowMoreSubHead";
import FileThumb from "@/components/atoms/FileThumb";
import TextWithIcon from "@/components/atoms/TextWithIcon";
import LightSearch from "@/icons/LightSearch";
import FilledFolder from "@/icons/FilledFolder";

export interface ISearchResultsProps {
  isOpened: boolean;
}

const hintsStatic = [
  {
    text: "Startups report generation",
  },
  { text: "EU - Startups" },
  { text: "Startup Poland Ambassadors" },
];

const folderHintsStatic = [
  {
    text: "Best startups ever",
    location: "My Drive",
  },
  {
    text: "Hot startups 2019 - Report",
    location: "My Drive",
  },
];

const fileHintsStatic = [
  {
    text: "Guidelines for new startup",
    type: "docx",
    location: "wordpress",
  },
  {
    text: "Hot startups 2018",
    type: "vnd.google-apps.document",
    location: "wp-content",
  },
  {
    text: "Hot startups 2017",
    type: "vnd.google-apps.spreadsheet",
    location: "wp-content",
  },
  {
    text: "Hot startups 2016",
    type: "vnd.google-apps.spreadsheet",
    location: "wp-content",
  },
];

const SearchResults: React.FC<ISearchResultsProps> = ({
  isOpened,
  ...props
}) => {
  return isOpened ? (
    <Scroller
      thin
      className="max-h-extend-app-bar"
      onMouseDown={(event) => event.preventDefault()}
      {...props}
    >
      <div className="left-0 w-full bg-white select-none z-30">
        {hintsStatic.map((hintProps, index) => (
          <SearchResultHint
            key={index}
            icon={<LightSearch className="content text-icon" width="20" />}
            {...hintProps}
          />
        ))}
        <Spacer />
        <ShowMoreSubHead
          subhead="Files"
          btnText="See all"
          className="pb-2 pl-5 pr-3 "
        />
        {folderHintsStatic.map(({ location, ...hintProps }, index) => (
          <SearchResultHint
            key={index}
            icon={<FilledFolder className="content text-icon-100" width="18" />}
            {...hintProps}
          >
            <TextWithIcon
              icon={<FilledFolder className="ml-2 text-icon-100" width="18" />}
              text={location}
              reversed
            />
          </SearchResultHint>
        ))}
        <ShowMoreSubHead
          subhead="Folders"
          btnText="See all"
          className="py-2 pl-5 pr-3 "
        />
        {fileHintsStatic.map(({ location, type, ...hintProps }, index) => (
          <SearchResultHint
            key={index}
            icon={<FileThumb type={type} />}
            {...hintProps}
          >
            <TextWithIcon
              icon={<FilledFolder className="ml-2 text-icon-100" width="18" />}
              text={location}
              reversed
            />
          </SearchResultHint>
        ))}
      </div>
    </Scroller>
  ) : null;
};

export default SearchResults;
