import { useEffect, useState } from "react";
import Modal from "./Modal";

export default function FormModal({
  title,
  fields,
  initial = {},
  submitLabel = "Save",
  onSubmit,
  onClose,
}) {
  const [values, setValues] = useState(() => {
    const result = {};

    fields.forEach((field) => {
      result[field.name] =
        initial[field.name] ??
        (
          field.type === "checkbox"
            ? true
            : field.type === "select"
              ? field.options?.[0]?.value ?? ""
              : ""
        );
    });

    return result;
  });

  const [errors, setErrors] =
    useState({});

  const [submitError, setSubmitError] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  /*
   * Keep initial values synchronized when a
   * parent changes the selected record.
   */
  useEffect(() => {
    const result = {};

    fields.forEach((field) => {
      result[field.name] =
        initial[field.name] ??
        (
          field.type === "checkbox"
            ? true
            : field.type === "select"
              ? field.options?.[0]?.value ?? ""
              : ""
        );
    });

    setValues(result);
    setErrors({});
    setSubmitError("");
  }, [initial, fields]);

  const set = (name, value) => {
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    /*
     * Remove the field-level error as soon as
     * the user changes that field.
     */
    setErrors((previous) => {
      if (!previous[name]) {
        return previous;
      }

      const next = {
        ...previous,
      };

      delete next[name];

      return next;
    });

    setSubmitError("");
  };

  const validate = () => {
    const nextErrors = {};

    fields.forEach((field) => {
      if (
        !field.required ||
        field.type === "checkbox"
      ) {
        return;
      }

      const value = values[field.name];

      if (
        value === "" ||
        value === null ||
        value === undefined
      ) {
        nextErrors[field.name] =
          "Required";
      }

      if (
        field.type === "number" &&
        value !== "" &&
        Number.isNaN(Number(value))
      ) {
        nextErrors[field.name] =
          "Enter a valid number";
      }

      if (
        field.min !== undefined &&
        value !== "" &&
        Number(value) < field.min
      ) {
        nextErrors[field.name] =
          `Minimum value is ${field.min}`;
      }
    });

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitError("");

    if (!validate()) {
      return;
    }

    const output = {};

    fields.forEach((field) => {
      if (field.type === "number") {
        output[field.name] =
          values[field.name] === ""
            ? null
            : Number(values[field.name]);
      } else {
        output[field.name] =
          values[field.name];
      }
    });

    setSubmitting(true);

    try {
      /*
       * The important difference from the old version:
       *
       * We WAIT for the backend operation.
       *
       * The modal only closes if the operation succeeds.
       */
      await onSubmit(output);

      onClose();
    } catch (error) {
      console.error(
        "Form submission failed:",
        error
      );

      setSubmitError(
        error?.message ||
          "Unable to save the changes."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={title}
      onClose={
        submitting
          ? undefined
          : onClose
      }
      footer={
        <>
          <button
            type="button"
            className="secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            form="form-modal"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : submitLabel}
          </button>
        </>
      }
    >
      <form
        id="form-modal"
        onSubmit={handleSubmit}
        className="form-grid"
      >
        {fields.map((field) => (
          <div
            key={field.name}
            className={
              field.type === "checkbox"
                ? "form-field check"
                : "form-field"
            }
          >
            {field.type === "checkbox" ? (
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={
                    !!values[field.name]
                  }
                  onChange={(event) =>
                    set(
                      field.name,
                      event.target.checked
                    )
                  }
                  disabled={submitting}
                />

                {field.label}
              </label>
            ) : (
              <>
                <label
                  htmlFor={field.name}
                >
                  {field.label}

                  {field.required && (
                    <span className="req">
                      {" "}
                      *
                    </span>
                  )}
                </label>

                {field.type ===
                "select" ? (
                  <select
                    id={field.name}
                    value={
                      values[field.name]
                    }
                    onChange={(event) =>
                      set(
                        field.name,
                        event.target.value
                      )
                    }
                    disabled={submitting}
                  >
                    {field.options?.map(
                      (option) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    type={
                      field.type ===
                      "number"
                        ? "number"
                        : field.type ===
                          "email"
                          ? "email"
                          : "text"
                    }
                    value={
                      values[field.name]
                    }
                    placeholder={
                      field.placeholder
                    }
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    onChange={(event) =>
                      set(
                        field.name,
                        event.target.value
                      )
                    }
                    disabled={submitting}
                  />
                )}

                {errors[field.name] && (
                  <span className="field-error">
                    {errors[field.name]}
                  </span>
                )}
              </>
            )}
          </div>
        ))}

        {submitError && (
          <div
            className="login-error"
            role="alert"
          >
            {submitError}
          </div>
        )}
      </form>
    </Modal>
  );
}
