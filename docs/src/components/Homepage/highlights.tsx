import { highlights } from "@site/src/utils/constants/highlight-constants";
import Heading from '@theme/Heading';
export function HighlightsSection() {
  return (
    <section className="margin-bottom--xl">
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <Heading as="h2">A reader, not another editor</Heading>
            <p>
              Markdown Reader is designed for people who want to open a Markdown file and read it clearly. It focuses on rendering, navigation, and a calm desktop reading experience.
            </p>
            <p>
              It is useful for READMEs, specs, changelogs, technical notes, study material, and documentation drafts.
            </p>
          </div>
          <div className="col col--6">
            <ul>
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}