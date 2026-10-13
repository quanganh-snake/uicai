import { PageHeader } from "@/components/layout/PageHeader";
import { REGISTRATION_FEES, CONFERENCE_INFO } from "@/data/conference";
import { MapPin, Check, Info } from "lucide-react";

export default function RegistrationFeesPage() {
  return (
    <div>
      <PageHeader
        title="Registration & Fees"
        description="Conference registration fees, entitlements, terms, and venue details for ICAI-2026."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Fees Table */}
        <div className="max-w-4xl space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Registration Fees
          </h2>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider font-semibold text-slate-600">
                <tr>
                  <th className="px-6 py-4">Registration Options</th>
                  <th className="px-6 py-4">Fees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {REGISTRATION_FEES.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {row.category}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#3124eb]">
                      {row.fee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Registration Inclusions */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Info className="h-4 w-4 text-[#3124eb]" />
              Important Terms & Entitlements
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-[#3124eb] shrink-0 mt-0.5" />
                <span>If an author has multiple accepted papers, each paper must be registered separately.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-[#3124eb] shrink-0 mt-0.5" />
                <span>Registration fees cover abstract booklet, conference materials, coffee breaks & lunch during the conference, and the gala dinner.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Transportation and accommodation are not included in the registration fee.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Venue Information */}
        <div className="max-w-4xl space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Conference Venue & Location
          </h2>
          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <MapPin className="h-6 w-6 text-[#3124eb] shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg text-slate-900">{CONFERENCE_INFO.venue}</h3>
              <p className="mt-1 text-sm text-slate-600">
                Organized by CMC University, Hanoi, Vietnam. Detailed venue building and transport directions will be communicated to registered authors and participants.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
