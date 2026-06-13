import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useToast } from "../../components/common/Toast";
import { signIn } from "../../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);

  function validate() {
    const e = {};
    if (!form.email) e.email = "이메일을 입력해주세요.";
    if (!form.password) e.password = "비밀번호를 입력해주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signIn(form);
      // gtag("event", "login", { method: "email", debug_mode: true });
      if (!remember) {
        sessionStorage.setItem("_no_persist", "1");
      } else {
        sessionStorage.removeItem("_no_persist");
      }
      navigate(from, { replace: true });
    } catch {
      toast("이메일 또는 비밀번호가 올바르지 않습니다.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          로그인
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          계정에 로그인하세요
        </p>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            label="이메일"
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            error={errors.email}
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
            error={errors.password}
          />
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary accent-primary cursor-pointer"
            />
            <span className="text-sm text-gray-600">로그인 유지하기</span>
          </label>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          계정이 없으신가요?{" "}
          <Link
            to="/auth/register"
            className="text-primary font-medium hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
