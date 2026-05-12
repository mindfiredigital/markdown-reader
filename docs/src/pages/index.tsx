import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import { HomepageHeader } from '../components/Homepage/header';
import { FeaturesSection } from '../components/Homepage/features';
import { HighlightsSection } from '../components/Homepage/highlights';


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