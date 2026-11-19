"use client";

import {
  FormEvent,
  startTransition,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addPost,
  deleteFiles,
  getPost,
  getPosts,
  softDeletePost,
  updatePost,
  uploadFiles,
} from "@/lib/khcn-aiesi/client";
import type {
  EditKHCNAIESIBody,
  KHCNAIESIBaiDang,
  UploadedFile,
} from "@/lib/khcn-aiesi/types";

const PAGE_SIZE = 10;
const ACCEPTED_FILES =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.zip,.rar";

interface PostFormState {
  id: string | null;
  title: string;
  summary: string;
  author: string;
  keywords: string;
  linhVuc: string;
  status: number;
  source: number;
  accountType: number;
  files: UploadedFile[];
}

const EMPTY_FORM: PostFormState = {
  id: null,
  title: "",
  summary: "",
  author: "",
  keywords: "",
  linhVuc: "",
  status: 0,
  source: 0,
  accountType: 0,
  files: [],
};

function postToForm(post: KHCNAIESIBaiDang): PostFormState {
  return {
    id: post.KHCN_AIESI_BaiDang_ID,
    title: post.KHCN_AIESI_BaiDang_TenBai ?? "",
    summary: post.KHCN_AIESI_BaiDang_TomTat ?? "",
    author: post.KHCN_AIESI_BaiDang_TacGia ?? "",
    keywords: post.KHCN_AIESI_BaiDang_TuKhoa ?? "",
    linhVuc: post.KHCN_AIESI_BaiDang_LinhVuc ?? "",
    status: post.KHCN_AIESI_BaiDang_TrangThai ?? 0,
    source: post.KHCN_AIESI_BaiDang_NguonTiepNhan ?? 0,
    accountType: post.KHCN_AIESI_BaiDang_LoaiTaiKhoan ?? 0,
    files: post.KHCN_AIESI_BaiDang_LinkFile,
  };
}

function toPayload(
  form: PostFormState,
): Omit<EditKHCNAIESIBody, "KHCN_AIESI_BaiDang_ID"> {
  return {
    KHCN_AIESI_BaiDang_TenBai: form.title,
    KHCN_AIESI_BaiDang_TomTat: form.summary,
    KHCN_AIESI_BaiDang_TacGia: form.author,
    KHCN_AIESI_BaiDang_TuKhoa: form.keywords,
    KHCN_AIESI_BaiDang_LinhVuc: form.linhVuc,
    KHCN_AIESI_BaiDang_LinkFile: form.files,
    KHCN_AIESI_BaiDang_TrangThai: form.status,
    KHCN_AIESI_BaiDang_NguoiXuLy_NoiDung: "",
    KHCN_AIESI_BaiDang_NguonTiepNhan: form.source,
    KHCN_AIESI_BaiDang_LoaiTaiKhoan: form.accountType,
  };
}

function statusLabel(status: number | null) {
  if (status === 1) return "Approved";
  if (status === 2) return "Rejected";
  return "Pending";
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      {message}
    </div>
  );
}

export function AiesiDemo() {
  const [posts, setPosts] = useState<KHCNAIESIBaiDang[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<PostFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingLoading, setEditingLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    setError("");
    try {
      const result = await getPosts({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        searchText: search || undefined,
        trangThai: status || undefined,
      });
      setPosts(result.body);
      setTotalPages(result.pagination.totalPages);
      setTotalRecords(result.pagination.totalRecords);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't load the data.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    let active = true;
    void getPosts({
      pageNumber: page,
      pageSize: PAGE_SIZE,
      searchText: search || undefined,
      trangThai: status || undefined,
    })
      .then((result) => {
        if (!active) return;
        setPosts(result.body);
        setTotalPages(result.pagination.totalPages);
        setTotalRecords(result.pagination.totalRecords);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setError(
          caught instanceof Error ? caught.message : "Couldn't load the data.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, search, status]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setFormError("");
    setDialogOpen(true);
  }

  async function openEdit(id: string) {
    setEditingLoading(true);
    setError("");
    try {
      const detail = await getPost(id);
      const post = detail.body[0];
      if (!post) throw new Error("Post not found.");
      setForm(postToForm(post));
      setFormError("");
      setDialogOpen(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't load the details.");
    } finally {
      setEditingLoading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const payload = toPayload(form);
      if (form.id) {
        await updatePost({ ...payload, KHCN_AIESI_BaiDang_ID: form.id });
        setNotice("Post updated.");
      } else {
        await addPost(payload);
        setNotice("Post added. The list has been reloaded.");
      }
      setDialogOpen(false);
      await loadPosts();
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : "Couldn't save the post.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setFormError("");
    try {
      const result = await uploadFiles(Array.from(files));
      setForm((current) => ({
        ...current,
        files: [...current.files, ...result.body],
      }));
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : "Couldn't upload the file.");
    } finally {
      setUploading(false);
    }
  }

  async function removeFile(file: UploadedFile) {
    if (!window.confirm(`Delete the physical file “${file.TenFileGoc}”?`)) return;
    setFormError("");
    try {
      await deleteFiles([file.URL]);
      const files = form.files.filter((item) => item.URL !== file.URL);
      setForm((current) => ({ ...current, files }));
      if (form.id) {
        await updatePost({
          ...toPayload({ ...form, files }),
          KHCN_AIESI_BaiDang_ID: form.id,
        });
        await loadPosts();
      }
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : "Couldn't delete the file.");
    }
  }

  async function removePost(post: KHCNAIESIBaiDang) {
    const title = post.KHCN_AIESI_BaiDang_TenBai || post.KHCN_AIESI_BaiDang_ID;
    if (!window.confirm(`Soft-delete the post “${title}”? Physical files will be kept.`)) {
      return;
    }
    setDeletingId(post.KHCN_AIESI_BaiDang_ID);
    setError("");
    try {
      await softDeletePost(post.KHCN_AIESI_BaiDang_ID);
      setNotice("Post soft-deleted. Physical files were not deleted.");
      await loadPosts();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't delete the post.");
    } finally {
      setDeletingId(null);
    }
  }

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setPage(1);
    setSearch(searchDraft.trim());
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">KHCN_AIESI</p>
            <h1 className="mt-1 text-xl font-semibold text-slate-950">
              Post API integration demo
            </h1>
            <p className="mt-2 max-w-[70ch] text-pretty text-sm leading-6 text-slate-600">
              CRUD, pagination, details, and file upload and deletion through a same-origin BFF.
              The sign-in token is only converted into a backend cookie on the server.
            </p>
          </div>
          <Button className="h-11 px-4 md:h-10" onClick={openCreate}>
            <Plus aria-hidden /> Add post
          </Button>
        </header>

        {notice ? (
          <div
            role="status"
            className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <span>{notice}</span>
            <button
              type="button"
              className="shrink-0 cursor-pointer"
              aria-label="Dismiss notice"
              onClick={() => setNotice("")}
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        ) : null}
        {error ? <ErrorBanner message={error} /> : null}

        <Card className="gap-0 py-0">
          <CardHeader className="border-b border-slate-200 py-4 sm:grid-cols-[1fr_auto]">
            <div>
              <CardTitle>Posts</CardTitle>
              <CardDescription className="mt-1 tabular-nums">
                {totalRecords} records shown
              </CardDescription>
            </div>
            <Button
              variant="outline"
              className="mt-3 h-11 md:mt-0 md:h-10"
              onClick={() => void loadPosts()}
              disabled={loading}
            >
              <RefreshCw className={loading ? "animate-spin" : ""} aria-hidden />
              Reload
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-[minmax(0,1fr)_12rem] sm:p-5">
              <form className="flex min-w-0 gap-2" onSubmit={applySearch}>
                <Input
                  type="search"
                  aria-label="Search posts"
                  placeholder="Search by title"
                  value={searchDraft}
                  onChange={(event) => setSearchDraft(event.target.value)}
                  className="h-11 md:h-10"
                />
                <Button variant="outline" className="h-11 px-3 md:h-10" type="submit">
                  <Search aria-hidden />
                  <span className="sr-only sm:not-sr-only">Search</span>
                </Button>
              </form>
              <select
                aria-label="Filter by status"
                value={status}
                onChange={(event) => {
                  setLoading(true);
                  setPage(1);
                  setStatus(event.target.value);
                }}
                className="h-11 cursor-pointer rounded-xl border border-input bg-white px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 md:h-10"
              >
                <option value="">All statuses</option>
                <option value="0">Pending</option>
                <option value="1">Approved</option>
                <option value="2">Rejected</option>
              </select>
            </div>

            {loading ? (
              <div className="flex min-h-64 items-center justify-center gap-2 p-6 text-sm text-slate-600">
                <LoaderCircle className="size-5 animate-spin" aria-hidden /> Loading data…
              </div>
            ) : posts.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
                <FileText className="size-8 text-slate-400" aria-hidden />
                <p className="mt-3 text-sm font-medium text-slate-950">No posts</p>
                <p className="mt-1 text-pretty text-sm text-slate-600">
                  Try a different keyword or create the first post.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {posts.map((post) => (
                  <article
                    key={post.KHCN_AIESI_BaiDang_ID}
                    className="grid gap-4 p-4 transition-colors hover:bg-slate-50 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="min-w-0 text-base font-medium text-slate-950">
                          {post.KHCN_AIESI_BaiDang_TenBai || "Untitled"}
                        </h2>
                        <Badge
                          variant={post.KHCN_AIESI_BaiDang_TrangThai === 2 ? "destructive" : "secondary"}
                        >
                          {statusLabel(post.KHCN_AIESI_BaiDang_TrangThai)}
                        </Badge>
                      </div>
                      <p className="mt-1 line-clamp-2 max-w-[75ch] text-pretty text-sm leading-6 text-slate-600">
                        {post.KHCN_AIESI_BaiDang_TomTat || "No summary yet."}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>{post.KHCN_AIESI_BaiDang_TacGia || "No author yet"}</span>
                        <span className="tabular-nums">
                          {post.KHCN_AIESI_BaiDang_LinkFile.length} file
                        </span>
                        <span className="font-mono" title={post.KHCN_AIESI_BaiDang_ID}>
                          {post.KHCN_AIESI_BaiDang_ID}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="outline"
                        className="h-10"
                        onClick={() => void openEdit(post.KHCN_AIESI_BaiDang_ID)}
                        disabled={editingLoading}
                      >
                        <Pencil aria-hidden /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        className="h-10"
                        onClick={() => void removePost(post)}
                        disabled={deletingId === post.KHCN_AIESI_BaiDang_ID}
                      >
                        {deletingId === post.KHCN_AIESI_BaiDang_ID ? (
                          <LoaderCircle className="animate-spin" aria-hidden />
                        ) : (
                          <Trash2 aria-hidden />
                        )}
                        Soft delete
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {totalRecords > 0 ? (
              <footer className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <p className="text-sm text-slate-600 tabular-nums">
                  Trang {page} / {Math.max(totalPages, 1)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="h-10"
                    disabled={page <= 1 || loading}
                    onClick={() => {
                      setLoading(true);
                      startTransition(() => setPage((value) => value - 1));
                    }}
                  >
                    <ChevronLeft aria-hidden /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10"
                    disabled={page >= totalPages || loading}
                    onClick={() => {
                      setLoading(true);
                      startTransition(() => setPage((value) => value + 1));
                    }}
                  >
                    Next <ChevronRight aria-hidden />
                  </Button>
                </div>
              </footer>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit post" : "Add post"}</DialogTitle>
            <DialogDescription>
              Creator/editor fields are taken from the backend session, not from the browser.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-5" onSubmit={submit}>
            {formError ? <ErrorBanner message={formError} /> : null}
            <div className="grid gap-2">
              <Label htmlFor="aiesi-title" required>Title</Label>
              <Input
                id="aiesi-title"
                required
                maxLength={2000}
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="aiesi-summary">Summary</Label>
              <textarea
                id="aiesi-summary"
                rows={4}
                value={form.summary}
                onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
                className="w-full resize-y rounded-xl border border-input bg-white px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="aiesi-author">Author</Label>
                <Input id="aiesi-author" value={form.author} onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="aiesi-keywords">Keywords</Label>
                <Input id="aiesi-keywords" maxLength={2000} value={form.keywords} onChange={(event) => setForm((current) => ({ ...current, keywords: event.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="aiesi-track">Track/Subcommittee</Label>
                <Input id="aiesi-track" maxLength={2000} value={form.linhVuc} onChange={(event) => setForm((current) => ({ ...current, linhVuc: event.target.value }))} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="aiesi-status">Status</Label>
                <select id="aiesi-status" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: Number(event.target.value) }))} className="h-11 rounded-xl border border-input bg-white px-3 text-sm md:h-10">
                  <option value={0}>Pending</option><option value={1}>Approved</option><option value={2}>Rejected</option>
                </select>
              </div>
              <div className="grid gap-2"><Label htmlFor="aiesi-source">Intake source</Label><Input id="aiesi-source" type="number" value={form.source} onChange={(event) => setForm((current) => ({ ...current, source: Number(event.target.value) }))} /></div>
              <div className="grid gap-2"><Label htmlFor="aiesi-account">Account type</Label><Input id="aiesi-account" type="number" value={form.accountType} onChange={(event) => setForm((current) => ({ ...current, accountType: Number(event.target.value) }))} /></div>
            </div>

            <div className="grid gap-3">
              <Label>Attachments</Label>
              <label className="flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-center transition-colors hover:bg-slate-100">
                <input type="file" multiple accept={ACCEPTED_FILES} className="sr-only" disabled={uploading} onChange={(event) => void handleUpload(event.target.files)} />
                {uploading ? <LoaderCircle className="size-5 animate-spin text-slate-500" aria-hidden /> : <Upload className="size-5 text-slate-500" aria-hidden />}
                <span className="mt-2 text-sm font-medium text-slate-950">{uploading ? "Uploading files…" : "Choose up to 10 files"}</span>
                <span className="mt-1 text-pretty text-xs text-slate-500">PDF, Office, images, ZIP or RAR. Up to 50 MiB per file.</span>
              </label>
              {form.files.length > 0 ? (
                <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200">
                  {form.files.map((file) => (
                    <li key={file.URL} className="flex min-w-0 items-center gap-3 p-3">
                      <FileText className="size-5 shrink-0 text-slate-500" aria-hidden />
                      <a href={file.URL} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900 hover:underline" title={file.TenFileGoc}>{file.TenFileGoc}</a>
                      <Button type="button" variant="destructive" size="icon" aria-label={`Delete file ${file.TenFileGoc}`} onClick={() => void removeFile(file)}><Trash2 aria-hidden /></Button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <DialogFooter className="mx-0 mb-0">
              <Button type="button" variant="outline" className="h-11 md:h-10" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
              <Button type="submit" className="h-11 md:h-10" disabled={saving || uploading}>
                {saving ? <LoaderCircle className="animate-spin" aria-hidden /> : null}
                {form.id ? "Save changes" : "Add post"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
