export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        w-full
        h-screen px-10
        primary-gradient
      "
    >
      <div
        className="
          h-full max-w-7xl mx-auto 
          flex gap-5 items-center justify-center
        "
      >
        <div className="hidden lg:block basis-1/2">
          <h1 className="text-4xl primary-heading-gradient sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight">
            Smash
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed">
            Experience the ultimate apps, mobile gaming adventure. Download now
            from the App Store and join millions of players worldwide.
          </p>
        </div>

        <div className="flex-1 lg:basis-1/2 max-w-7xl w-full flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
