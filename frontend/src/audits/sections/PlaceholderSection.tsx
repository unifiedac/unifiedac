import { TextareaBlock } from '../../components/form/TextareaBlock';
import { SectionScaffold } from './SectionScaffold';

export function PlaceholderSection({ title }: { title: string }) {
  return (
    <SectionScaffold title={title}>
      <TextareaBlock id={`section-${title}`} label={`${title} Notes`} placeholder={`Capture findings for ${title.toLowerCase()}...`} />
    </SectionScaffold>
  );
}
