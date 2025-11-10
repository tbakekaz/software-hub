"use client";
import { useEffect, useState } from 'react';
import { getUser, setUser, type User } from '@/lib/auth';
import { CardBase, CardHeader, CardBody, CardBadge } from '@/components/CardBase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProBadge } from '@/components/ProBadge';

export default function AccountClient({ dict }: { dict: any }) {
  const [user, setLocal] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLocal(getUser());
    setLoading(false);
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
    </main>
  );
}
