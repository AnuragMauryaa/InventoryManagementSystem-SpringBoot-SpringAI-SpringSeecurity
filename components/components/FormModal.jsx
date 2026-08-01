import { useState } from 'react';
import Modal from './Modal';

export default function FormModal({
  title,
  fields,
 initial = {},
  submitLabel = 'Save',
  onSubmit,
  onClose
}) {

  const [values, setValues] = useState(() => {

    const obj = {};

    fields.forEach((field) => {

      obj[field.name] =
        initial[field.name] ??
        (
          field.type === 'checkbox'
            ? true
            : field.type === 'select'
            ? field.options?.[0]?.value ?? ''
            : ''
        );

    });

    return obj;

  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const setValue = (name, value) => {

    setValues((prev) => ({
      ...prev,
      [name]: value
    }));

  };

  const validate = () => {

    const e = {};

    fields.forEach((field) => {

      if (!field.required) return;

      if (field.type === 'checkbox') return;

      const value = values[field.name];

      if (
        value === '' ||
        value === null ||
        value === undefined
      ) {
        e[field.name] = 'Required';
      }

    });

    setErrors(e);

    return Object.keys(e).length === 0;

  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    if (!validate()) return;

    const output = {};

    fields.forEach((field) => {

      output[field.name] =
        field.type === 'number'
          ? Number(values[field.name])
          : values[field.name];

    });

    try {

      setSaving(true);

      await onSubmit(output);

      onClose();

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Operation failed.'
      );

    } finally {

      setSaving(false);

    }

  };

  return (

    <Modal
      title={title}
      onClose={saving ? () => {} : onClose}
      footer={
        <>
          <button
            type="button"
            className="secondary"
            disabled={saving}
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            form="form-modal"
            disabled={saving}
          >
            {saving ? 'Saving...' : submitLabel}
          </button>
        </>
      }
    >

      <form
        id="form-modal"
        className="form-grid"
        onSubmit={handleSubmit}
      >

        {fields.map((field) => (

          <div
            key={field.name}
            className={
              field.type === 'checkbox'
                ? 'form-field check'
                : 'form-field'
            }
          >

            {field.type === 'checkbox' ? (

              <label className="check-label">

                <input
                  type="checkbox"
                  checked={!!values[field.name]}
                  onChange={(e) =>
                    setValue(field.name, e.target.checked)
                  }
                />

                {field.label}

              </label>

            ) : (

              <>

                <label htmlFor={field.name}>
                  {field.label}

                  {field.required && (
                    <span className="req"> *</span>
                  )}
                </label>

                {field.type === 'select' ? (

                  <select
                    id={field.name}
                    value={values[field.name]}
                    onChange={(e) =>
                      setValue(field.name, e.target.value)
                    }
                  >

                    {field.options.map((option) => (

                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>

                    ))}

                  </select>

                ) : (

                  <input
                    id={field.name}
                    type={
                      field.type === 'number'
                        ? 'number'
                        : field.type === 'email'
                        ? 'email'
                        : 'text'
                    }
                    value={values[field.name]}
                    placeholder={field.placeholder}
                    min={field.min}
                    step={field.step}
                    onChange={(e) =>
                      setValue(field.name, e.target.value)
                    }
                  />

                )}

                {errors[field.name] && (

                  <div
                    style={{
                      color: '#dc2626',
                      fontSize: 12,
                      marginTop: 4
                    }}
                  >
                    {errors[field.name]}
                  </div>

                )}

              </>

            )}

          </div>

        ))}

      </form>

    </Modal>

  );

}