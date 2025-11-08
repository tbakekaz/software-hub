export default function SponsorPage() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">赞助 / 打赏</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="border rounded p-4"><h2 className="font-medium">Kaspi</h2><div className="text-sm">占位二维码</div></div>
        <div className="border rounded p-4"><h2 className="font-medium">银行卡</h2><div className="text-sm">**** **** **** 0000</div></div>
        <div className="border rounded p-4"><h2 className="font-medium">Crypto</h2><div className="text-sm">USDT(ERC20): 0x...</div></div>
      </div>
    </main>
  );
}




