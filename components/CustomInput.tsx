import React from 'react';
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';

import { Control, FieldPath } from 'react-hook-form';
import { z } from 'zod';
import { authFormSchema } from '@/lib/utils';

// Schema for form validation (defined elsewhere in your code)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = authFormSchema('sign-up');

interface CustomInput {
  control: Control<z.infer<typeof formSchema>>; // React Hook Form control
  name: FieldPath<z.infer<typeof formSchema>>; // The field name from form schema
  label: string; // Label for the input field
  placeholder: string; // Placeholder text for the input field
}

// Custom input component for form fields
const CustomInput = ({ control, name, label, placeholder }: CustomInput) => {
  return (
    <FormField
      control={control} // Pass control from React Hook Form
      name={name} // Bind the form field to the name
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>{' '}
          {/* Display the label */}
          <div className="flex w-full flex-col">
            <FormControl>
              {/* Input component that is connected to the form field */}
              <Input
                placeholder={placeholder} // Set the placeholder
                className="input-class" // Apply custom styling class
                type={name === 'password' ? 'password' : 'text'} // If the field is 'password', set input type as 'password'
                {...field} // Spread field props to bind it with React Hook Form
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />{' '}
            {/* Display error message */}
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;
