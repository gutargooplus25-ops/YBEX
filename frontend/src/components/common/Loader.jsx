const Loader = ({ fullScreen = false }) => {
  const spinner = (
    <div className="w-8 h-8 border-2 border-[#58549C]/30 border-t-[#58549C] rounded-full animate-spin" />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center py-8">{spinner}</div>;
};

export default Loader;
