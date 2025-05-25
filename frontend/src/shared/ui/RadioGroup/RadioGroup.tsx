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
  <div className=''>
    <h3 className='font-medium capitalize'>{name}</h3>
    <div className=''>
      {options.map(option => (
        <label key={option.value} className='flex items-center gap-1'>
          <input
            type='radio'
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className='h-4 w-4'
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);
