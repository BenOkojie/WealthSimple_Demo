export default function Chip({ label }: { label: string }) {
return (
<span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">
{label}
</span>
);
}