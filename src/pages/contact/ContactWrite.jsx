import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useToast } from "../../components/common/Toast";
import { useAuth } from "../../hooks/useAuth";
import { createInquiry } from "../../services/inquiries";

export default function ContactWrite() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ title: "", content: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "제목을 입력해주세요.";
    if (!form.content.trim()) e.content = "내용을 입력해주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await createInquiry({ ...form, userId: user.id });
      gtag("event", "contactus");
      toast("문의가 접수되었습니다.", "success");
      navigate("/contact/my");
    } catch {
      toast("문의 접수 중 오류가 발생했습니다.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[800px] mx-auto px-5 md:px-10 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">온라인 문의</h1>
      <p className="text-sm text-gray-500 mb-8">
        궁금하신 점을 남겨주시면 빠르게 답변드리겠습니다.
      </p>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <Input
          label="제목"
          placeholder="문의 제목을 입력해주세요"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          error={errors.title}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">내용</label>
          <textarea
            rows={10}
            placeholder="문의 내용을 자세히 입력해주세요"
            value={form.content}
            onChange={(e) =>
              setForm((p) => ({ ...p, content: e.target.value }))
            }
            className={`px-3.5 py-3 rounded-lg border text-sm outline-none resize-none
              ${errors.content ? "border-red-500" : "border-gray-300 focus:border-primary"}
              focus:ring-2 focus:ring-primary/15`}
          />
          {errors.content && (
            <p className="text-xs text-red-500">{errors.content}</p>
          )}
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/")}
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? "접수 중..." : "문의 접수"}
          </Button>
        </div>
      </form>
    </div>
  );
}
