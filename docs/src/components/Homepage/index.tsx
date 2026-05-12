import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import { HomepageHeader } from './header';
import { FeaturesSection } from './features';
import { HighlightsSection } from './highlights';


export default function Home(): ReactNode {
  return (
    <Layout
      title="Markdown Reader"
      description="A native desktop Markdown reader for technical documents, README files, notes, and specs.">
      <HomepageHeader />
      <main>
        <FeaturesSection />
        <HighlightsSection />
      </main>
    </Layout>
  );
}