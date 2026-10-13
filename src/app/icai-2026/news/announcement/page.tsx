import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AnnouncementPage() {
  return (
    <div>
      <PageHeader
        title="News"
        description="Announcement on the Conference Name Change"
      />

      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-4 text-slate-600 hover:text-slate-900 -ml-2">
              <Link href="/icai-2026/news">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to News
              </Link>
            </Button>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#3124eb] mb-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>August 11, 2026</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Announcement on the Conference Name Change
            </h1>
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
            <p>
              Following consultations with the co-organizing institutions and the Scientific Committee, the Organizing Committee is pleased to announce the official change of the conference name as follows:
            </p>

            <div className="rounded-xl bg-blue-50/60 border border-blue-200/80 p-5 space-y-2">
              <p className="font-semibold text-slate-900">
                <strong>New official name:</strong> The Second International Conference on AI: AI-Native for Universities and Industry
              </p>
              <p className="font-semibold text-[#3124eb]">
                <strong>Abbreviation:</strong> ICAI-2026
              </p>
            </div>

            <p>
              The new name more accurately reflects the shift from using AI as a collection of standalone support tools toward an AI-native approach, in which AI becomes a core capability across education, research, university governance, business operations, and product development.
            </p>

            <p>
              It also aligns more closely with the conference’s academic and professional focus, particularly its discussions on the adoption and integration of AI in universities and industry. At the same time, the new name highlights the conference’s role in strengthening collaboration among universities, research institutions, and industry partners.
            </p>

            <p>
              Please note that this change applies only to the conference name. The conference topics, important dates, proceedings publication arrangements, submission requirements, and all other previously announced information remain unchanged.
            </p>

            <p>
              Authors, speakers, partners, and participants are kindly invited to use the new official name and abbreviation in future communications and materials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

