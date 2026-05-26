export function Logo({ classes }: { classes?: string }) {
  return (
    <div className={classes}>
        <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center shadow-2xl shadow-[#7dd3c0]/30">
            <img src="/Logo.svg" alt="LocalLoop Logo" className="w-12 h-12" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] rounded-full blur-xl opacity-40 animate-pulse" />
        </div>
        <div>
            <h1 className="text-xl font-medium bg-gradient-to-r from-[#7dd3c0] via-[#a8d5ba] to-[#89cff0] bg-clip-text text-transparent">
            LocalLoop
            </h1>
            <p className="text-xs text-[#b8b5ad]">Twoja Społeczność</p>
        </div>
        </div>
    </div>
  );
}

export function LogoOnly({ classes }: { classes?: string }) {
  return (
    <div className={classes}>
        <div className="relative rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center shadow-2xl shadow-[#7dd3c0]/30">
            <img src="/Logo.svg" alt="LocalLoop Logo" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] rounded-full blur-xl opacity-40 animate-pulse" />
        </div>
    </div>
  );    
}

