const PageHeader = ({ title }) => {
  return (
    <div className="bg-[#f9f9f7] dark:bg-[#1c1310] pt-8 pb-6 px-6 md:pt-10 md:pb-6 text-center font-['DM_Sans',sans-serif]">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-['Playfair_Display',serif] text-4xl md:text-6xl font-bold text-[#2C2F34] dark:!text-white leading-tight">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default PageHeader;
