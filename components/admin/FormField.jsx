import React from 'react';

const FormField = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  options = [],
  rows = 4,
  error,
  helpText,
}) => {
  const baseInputClass = "w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors text-sm";
  const errorInputClass = "border-rose-500/50 focus:border-rose-500";
  const finalInputClass = `${baseInputClass} ${error ? errorInputClass : ''}`;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={finalInputClass}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          value={value || ''}
          onChange={onChange}
          required={required}
          className={finalInputClass}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-zinc-950 text-zinc-100">
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'toggle' ? (
        <div className="flex items-center min-h-[40px]">
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              id={id}
              checked={!!value}
              onChange={(e) => onChange({ target: { id, value: e.target.checked } })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-checked:after:bg-white"></div>
            {helpText && <span className="ml-3 text-sm text-zinc-400">{helpText}</span>}
          </label>
        </div>
      ) : (
        <input
          id={id}
          type={type}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={finalInputClass}
        />
      )}

      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
      {!error && helpText && type !== 'toggle' && <p className="mt-1 text-xs text-zinc-500">{helpText}</p>}
    </div>
  );
};

export default FormField;
