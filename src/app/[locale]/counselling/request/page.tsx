import { IntakeForm } from "@/components/counselling/intake-form";
import { beneficiaryCategories, type BeneficiaryCategory } from "@/lib/types";

export const metadata = {
  title: "Counselling request",
  robots: { index: false, follow: false, nocache: true },
};

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const initialCategory = beneficiaryCategories.includes(category as BeneficiaryCategory)
    ? (category as BeneficiaryCategory)
    : undefined;

  return <IntakeForm initialCategory={initialCategory} />;
}
