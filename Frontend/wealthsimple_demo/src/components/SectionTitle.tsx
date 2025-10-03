export default function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
return (
<div className="mb-3">
<h3 className="text-lg font-semibold tracking-tight">{title}</h3>
{subtitle ? <p className="text-sm text-neutral-500">{subtitle}</p> : null}
</div>
);
}