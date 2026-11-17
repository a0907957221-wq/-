export function Header() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({behavior: 'smooth'});
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('overview');
          }}
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          Python 物件工坊
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600" aria-label="主導覽列">
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('overview');
            }}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            課程總覽
          </a>
          <a
            href="#class-sandbox"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('class-sandbox');
            }}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            類別與物件
          </a>
          <a
            href="#oop-pillars"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('oop-pillars');
            }}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            繼承與封裝
          </a>
          <a
            href="#deploy-guide"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('deploy-guide');
            }}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            GitHub 與 Netlify
          </a>
        </nav>

        <button
          type="button"
          onClick={() => scrollToSection('quiz')}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          隨堂挑戰
        </button>
      </div>
    </header>
  );
}
