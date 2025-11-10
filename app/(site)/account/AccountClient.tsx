"use client";
import { useEffect, useState, useRef } from 'react';
import { getUser, setUser, type User } from '@/lib/auth';
import { CardBase, CardHeader, CardBody, CardBadge } from '@/components/CardBase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ProBadge } from '@/components/ProBadge';

export default function AccountClient({ dict = {} }: { dict?: any }) {
  const [user, setLocal] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const passwordTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLocal(getUser());
      setLoading(false);
    }
    
    // 清理定时器
    return () => {
      if (passwordTimerRef.current) {
        clearTimeout(passwordTimerRef.current);
        passwordTimerRef.current = null;
      }
    };
  }, []);

  const handleUpgrade = () => {
    const u = getUser();
    if (!u) {
      window.location.href = '/pricing';
      return;
    }
    if (confirm(dict.pricing?.note || '确认升级为 Pro 会员？')) {
      u.plan = 'pro';
      setUser(u);
      setLocal(u);
    }
  };

  const handleChangePassword = () => {
    // 重置错误和成功消息
    setPasswordError('');
    setPasswordSuccess(false);

    // 验证输入
    if (!newPassword) {
      setPasswordError('请输入新密码');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('密码长度至少为 6 位');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('两次输入的密码不一致');
      return;
    }

    // 验证当前密码（如果已设置）
    const u = getUser();
    if (!u) {
      setPasswordError('用户信息不存在');
      return;
    }

    if (u.password && u.password !== currentPassword) {
      setPasswordError('当前密码不正确');
      return;
    }

    // 更新密码
    u.password = newPassword;
    setUser(u);
    setLocal(u);

    // 清除之前的定时器
    if (passwordTimerRef.current) {
      clearTimeout(passwordTimerRef.current);
      passwordTimerRef.current = null;
    }

    // 显示成功消息
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    // 3秒后隐藏表单
    if (typeof window !== 'undefined') {
      passwordTimerRef.current = window.setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess(false);
        passwordTimerRef.current = null;
      }, 3000);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">加载中...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <CardBase>
          <CardHeader className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">请先登录</h2>
            <p className="text-sm text-muted-foreground">您需要登录后才能访问会员中心</p>
          </CardHeader>
          <CardBody>
            <Button onClick={() => (window.location.href = '/pricing')}>
              {dict.auth?.login || '登录'}
            </Button>
          </CardBody>
        </CardBase>
      </main>
    );
  }

  const isPro = user.plan === 'pro';

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">会员中心</h1>
        <ProBadge />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <CardBase>
          <CardHeader className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">账户信息</h2>
            <CardBadge className="bg-primary/10 text-primary">{isPro ? 'Pro 会员' : '免费用户'}</CardBadge>
          </CardHeader>
          <CardBody className="space-y-3 text-sm">
            <div>
              <div className="text-muted-foreground">用户名</div>
              <div className="font-medium text-base">{user.name}</div>
            </div>
            {user.email && (
              <div>
                <div className="text-muted-foreground">邮箱</div>
                <div className="font-medium text-base">{user.email}</div>
              </div>
            )}
            <div>
              <div className="text-muted-foreground">会员类型</div>
              <div className="font-medium text-base">
                {isPro ? (
                  <Badge className="bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white">Pro</Badge>
                ) : (
                  <Badge className="border text-muted-foreground">Free</Badge>
                )}
              </div>
            </div>
          </CardBody>
        </CardBase>

        <CardBase>
          <CardHeader className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">会员权益</h2>
            <p className="text-sm text-muted-foreground">
              {isPro ? '感谢支持！以下权益均已解锁。' : '升级后将解锁以下权益：'}
            </p>
          </CardHeader>
          <CardBody className="space-y-2 text-sm">
            {['隐藏站内广告', '优先展示镜像下载', 'AI 导航增强功能'].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <span className={isPro ? 'text-green-500' : 'text-muted-foreground'}>{isPro ? '✓' : '✗'}</span>
                <span className={isPro ? '' : 'text-muted-foreground'}>{benefit}</span>
              </div>
            ))}
            {!isPro && (
              <Button onClick={handleUpgrade} className="w-full mt-4">
                {dict.pricing?.cta || '立即升级'}
              </Button>
            )}
          </CardBody>
        </CardBase>
      </div>

      {isPro && (
        <CardBase>
          <CardHeader>
            <h2 className="text-lg font-semibold">订阅信息</h2>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-muted-foreground">您的 Pro 会员已激活。感谢您的支持！</p>
          </CardBody>
        </CardBase>
      )}

      {/* 修改密码卡片 */}
      <CardBase>
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">修改密码</h2>
            {!showPasswordForm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowPasswordForm(true);
                  setPasswordError('');
                  setPasswordSuccess(false);
                }}
              >
                修改密码
              </Button>
            )}
          </div>
        </CardHeader>
        {showPasswordForm && (
          <CardBody className="space-y-4">
            {passwordSuccess && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm">
                ✓ 密码修改成功！
              </div>
            )}
            {passwordError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                {passwordError}
              </div>
            )}
            <div className="space-y-3">
              {user.password && (
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">当前密码</label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="请输入当前密码"
                    className="w-full"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">新密码</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="请输入新密码（至少6位）"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">确认新密码</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入新密码"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleChangePassword}
                className="flex-1"
              >
                确认修改
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordForm(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordError('');
                  setPasswordSuccess(false);
                }}
              >
                取消
              </Button>
            </div>
          </CardBody>
        )}
        {!showPasswordForm && (
          <CardBody>
            <p className="text-sm text-muted-foreground">
              {user.password ? '已设置密码' : '尚未设置密码，建议设置密码以保护账户安全'}
            </p>
          </CardBody>
        )}
      </CardBase>
    </main>
  );
}
