import type { SubmissionStatus } from "@/data/submissions";

export interface AdminSubmissionRecord {
  submitter: {
    id: number;
    username: string;
    fullName: string;
    email: string;
  };
  paper: {
    id: string;
    title: string;
    track: string;
    submittedAt: string;
    status: SubmissionStatus;
  };
}

export interface AdminSubmissionGroup {
  submitter: AdminSubmissionRecord["submitter"];
  papers: AdminSubmissionRecord["paper"][];
}

export function groupAdminSubmissions(
  submissions: readonly AdminSubmissionRecord[],
): AdminSubmissionGroup[] {
  const groups = new Map<number, AdminSubmissionGroup>();

  for (const submission of submissions) {
    const existingGroup = groups.get(submission.submitter.id);

    if (existingGroup) {
      existingGroup.papers.push(submission.paper);
      continue;
    }

    groups.set(submission.submitter.id, {
      submitter: submission.submitter,
      papers: [submission.paper],
    });
  }

  return Array.from(groups.values()).map((group) => ({
    ...group,
    papers: group.papers.toSorted(
      (left, right) =>
        new Date(right.submittedAt).getTime() -
        new Date(left.submittedAt).getTime(),
    ),
  }));
}
