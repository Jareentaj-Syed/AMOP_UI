interface AdvancedFilterGroupProps {
    title: string;
    filters: React.ReactNode;
  }
  
  export const AdvancedFilterGroup: React.FC<AdvancedFilterGroupProps> = ({
    title,
    filters,
  }) => {
    return (
      <div className="mb-4">
        <div className="font-semibold mb-0.5 text-base">{title}</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {filters}
        </div>
      </div>
    );
  };
  