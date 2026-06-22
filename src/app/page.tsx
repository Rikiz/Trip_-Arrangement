import Link from "next/link";
import { ArrowRight, MapPin, Users, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-12">
        {/* Hero */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] text-sm">
            <Sparkles className="w-4 h-4" />
            <span>行程规划 · 智能推荐</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
            <span className="text-[var(--foreground)]">下一次旅行</span>
            <br />
            <span className="text-[var(--primary)]">从了解彼此开始</span>
          </h1>

          <p className="text-lg text-[var(--muted-foreground)] max-w-lg mx-auto leading-relaxed">
            创建一个问卷，分享给你的旅行伙伴。
            收集大家的偏好后，系统自动推荐最适合你们的目的地和行程。
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stagger-animation">
          {[
            {
              step: "01",
              icon: MapPin,
              title: "设定行程框架",
              desc: "输入出发地、天数、候选目的地",
            },
            {
              step: "02",
              icon: Users,
              title: "分享问卷给朋友",
              desc: "一键复制链接，发到微信群",
            },
            {
              step: "03",
              icon: Sparkles,
              title: "查看智能推荐",
              desc: "系统分析偏好，生成最优行程",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="group relative p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/5"
            >
              <span className="absolute top-4 right-4 font-serif text-5xl font-bold text-[var(--muted)] select-none">
                {item.step}
              </span>
              <item.icon className="w-8 h-8 text-[var(--primary)] mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-serif text-lg font-semibold mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-medium text-lg hover:opacity-90 transition-all duration-200 hover:gap-3 hover:shadow-lg"
          >
            开始创建行程
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Decorative bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--muted)]/50 to-transparent pointer-events-none -z-10" />
    </main>
  );
}
