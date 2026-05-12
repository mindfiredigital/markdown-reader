import { features } from "@site/src/utils/constants/feature-contants";
import Heading from '@theme/Heading';
export function FeaturesSection() {
  return (
    <section className="margin-vert--xl">
      <div className="container">
        <div className="row">
          {features.map((feature) => (
            <div className="col col--4 margin-bottom--lg" key={feature.title}>
              <div className="card">
                <div className="card__body">
                  <Heading as="h3">{feature.title}</Heading>
                  <p>{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}