import React, { useMemo, useState } from "react";
import { Loader2, User as UserIcon, Shield, Lock } from "lucide-react";
import { PasswordStrengthBar } from "./password-strength.bar";
import {
  computeStrength,
  strengthLabel,
} from "../../../common/helpers/profile.helper";

// ===== Types =====
type Role = "admin" | "staff";

interface User {
  username: string;
  full_name: string;
  role: Role;
  created_at: string; // ISO string
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirm: string;
}

// ===== Mock dữ liệu người dùng =====
const mockUser: User = {
  username: "admin01",
  full_name: "Nguyễn Văn A",
  role: "admin",
  created_at: "2025-10-10T08:00:00Z",
};

// ===== Utils =====

// ===== Component =====
const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User>(mockUser);
  const [saving, setSaving] = useState<boolean>(false);
  const [pwdSaving, setPwdSaving] = useState<boolean>(false);
  const [form, setForm] = useState<Pick<User, "full_name">>({
    full_name: user.full_name,
  });
  const [pwdForm, setPwdForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [message, setMessage] = useState<string>("");

  const newPwScore = useMemo<number>(
    () => computeStrength(pwdForm.newPassword),
    [pwdForm.newPassword]
  );

  const onSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setUser((prev) => ({ ...prev, full_name: form.full_name.trim() }));
      setMessage("Cập nhật họ tên thành công!");
      setSaving(false);
    }, 800);
  };

  const onChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPwdSaving(true);
    setTimeout(() => {
      if (pwdForm.newPassword !== pwdForm.confirm) {
        setMessage("Mật khẩu mới và xác nhận không khớp.");
      } else if (newPwScore < 3) {
        setMessage(
          "Mật khẩu quá yếu. Hãy dùng ít nhất 8 ký tự, có chữ hoa, chữ thường và số/ký tự đặc biệt."
        );
      } else {
        setMessage("Đổi mật khẩu thành công!");
        setPwdForm({ currentPassword: "", newPassword: "", confirm: "" });
      }
      setPwdSaving(false);
    }, 800);
  };

  const formatDateTime = (iso?: string): string => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex items-center gap-3 mb-6">
        <UserIcon className="h-10 w-10 text-slate-600" />
        <div>
          <h1 className="text-2xl font-semibold">Hồ sơ người dùng</h1>
          <p className="text-slate-500 text-sm">
            Hiển thị và cập nhật thông tin người dùng
          </p>
        </div>
      </header>

      {message && (
        <div className="mb-4 p-3 rounded-xl bg-green-100 text-green-700 border border-green-200">
          {message}
        </div>
      )}

      {/* Thông tin hệ thống */}
      <section className="border rounded-2xl p-4 mb-6 bg-white shadow-sm">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Shield className="h-5 w-5" /> Thông tin hệ thống
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div>
            <dt className="text-slate-500">User name</dt>
            <dd className="font-medium">{user.username}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Vai trò</dt>
            <dd className="font-medium capitalize">{user.role}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Ngày tạo</dt>
            <dd className="font-medium">{formatDateTime(user.created_at)}</dd>
          </div>
        </dl>
      </section>

      {/* Cập nhật hồ sơ */}
      <form
        onSubmit={onSaveProfile}
        className="border rounded-2xl p-4 mb-6 bg-white shadow-sm"
      >
        <h2 className="font-semibold mb-2">Cập nhật hồ sơ</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm mb-1">Họ và tên</label>
            <input
              className="border rounded-xl w-full p-2 outline-none focus:ring-4 focus:ring-slate-100"
              value={form.full_name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, full_name: e.target.value }))
              }
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl"
          disabled={saving}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Lưu thay đổi
        </button>
      </form>

      {/* Đổi mật khẩu */}
      <form
        onSubmit={onChangePassword}
        className="border rounded-2xl p-4 bg-white shadow-sm"
      >
        <div className="flex items-center gap-2 mb-2">
          <Lock className="h-5 w-5" />
          <h2 className="font-semibold">Đổi mật khẩu</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Mật khẩu hiện tại</label>
            <input
              type="password"
              className="border rounded-xl w-full p-2 outline-none focus:ring-4 focus:ring-slate-100"
              placeholder="Nhập mật khẩu hiện tại"
              value={pwdForm.currentPassword}
              onChange={(e) =>
                setPwdForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Mật khẩu mới</label>
            <input
              type="password"
              className="border rounded-xl w-full p-2 outline-none focus:ring-4 focus:ring-slate-100"
              placeholder="Nhập mật khẩu mới"
              value={pwdForm.newPassword}
              onChange={(e) =>
                setPwdForm((prev) => ({ ...prev, newPassword: e.target.value }))
              }
              required
            />
            <PasswordStrengthBar score={newPwScore} />
            <p className="mt-1 text-xs text-slate-500">
              Độ mạnh: {strengthLabel(newPwScore)}
            </p>
          </div>
          <div>
            <label className="block text-sm mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              className="border rounded-xl w-full p-2 outline-none focus:ring-4 focus:ring-slate-100"
              placeholder="Xác nhận lại mật khẩu của bạn"
              value={pwdForm.confirm}
              onChange={(e) =>
                setPwdForm((prev) => ({ ...prev, confirm: e.target.value }))
              }
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl"
          disabled={pwdSaving}
        >
          {pwdSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
