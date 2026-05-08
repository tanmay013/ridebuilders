import type { FC } from "react";
import ScrollFadeText from "./ScrollFadeText";

const STORY_TEXT = [
  "Two wheels or four.",
  "Every machine tells a story.",
  "We help you read it.",
].join("\n");

const StorySection: FC = () => {
  return (
    <section
      id="story"
      className="relative bg-black py-32 md:py-48 px-6 md:px-10 lg:px-16"
    >
      <ScrollFadeText
        text={STORY_TEXT}
        className="max-w-4xl mx-auto text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.15] tracking-tight"
      />
    </section>
  );
};

export default StorySection;
