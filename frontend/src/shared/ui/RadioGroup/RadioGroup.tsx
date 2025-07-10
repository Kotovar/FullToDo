interface RadioGroupProps {
  name: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export const RadioGroup = ({
  name,
  options,
  value,
  onChange,
}: RadioGroupProps) => {
  return (
    <>
      <p className='font-medium capitalize md:text-sm'>{name}</p>
      <div className='flex flex-col gap-1'>
        {options.map(option => (
          <label
            key={option.value}
            className='flex items-center gap-1 text-base leading-none md:text-xs'
          >
            <input
              type='radio'
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className='focus-visible:ring-dark h-3 w-3 focus:outline-none focus-visible:ring-2'
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </>
  );
};
