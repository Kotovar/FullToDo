export const RadioGroup = ({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) => (
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
            className='h-3 w-3'
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  </>
);
