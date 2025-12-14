'use client';

interface Props {
  mainContent: React.ReactNode;
  rightContent?: React.ReactNode;
}

export default function UniversalPageLayout({ mainContent, rightContent }: Props) {
  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-4">
        <main className="w-full lg:flex-1">{mainContent}</main>
        {rightContent && (
          <aside className="hidden lg:block w-80 shrink-0">
            {rightContent}
          </aside>
        )}
      </div>
    </div>
  );
}

