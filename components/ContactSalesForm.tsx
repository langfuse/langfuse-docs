"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";
import {
  contactFormSchema,
  defaultFormValues,
  FORM_FIELDS,
  type ContactFormData,
} from "@/lib/contact-sales-form";

export function ContactSalesForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ContactFormData>({
    resolver: standardSchemaResolver(contactFormSchema),
    defaultValues: defaultFormValues,
  });

  const selectedRequirements = form.watch("enterpriseRequirements");

  const toggleRequirement = (value: string) => {
    const current = form.getValues("enterpriseRequirements");
    if (current.includes(value)) {
      form.setValue(
        "enterpriseRequirements",
        current.filter((v) => v !== value),
        { shouldValidate: true }
      );
    } else {
      form.setValue("enterpriseRequirements", [...current, value], {
        shouldValidate: true,
      });
    }
  };

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center gap-4">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <h3 className="text-xl font-semibold">Thank you for reaching out!</h3>
        <p className="text-muted-foreground">
          We&apos;ve sent a confirmation to your email. Our team will get back
          to you shortly.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name={FORM_FIELDS.name.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {FORM_FIELDS.name.label}{" "}
                {FORM_FIELDS.name.required && (
                  <span className="text-destructive">*</span>
                )}
              </FormLabel>
              <FormControl>
                <Input placeholder={FORM_FIELDS.name.placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={FORM_FIELDS.email.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {FORM_FIELDS.email.label}{" "}
                {FORM_FIELDS.email.required && (
                  <span className="text-destructive">*</span>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={FORM_FIELDS.email.placeholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={FORM_FIELDS.company.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {FORM_FIELDS.company.label}{" "}
                {FORM_FIELDS.company.required && (
                  <span className="text-destructive">*</span>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={FORM_FIELDS.company.placeholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={FORM_FIELDS.message.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {FORM_FIELDS.message.label}{" "}
                {FORM_FIELDS.message.required && (
                  <span className="text-destructive">*</span>
                )}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={FORM_FIELDS.message.placeholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={FORM_FIELDS.usage.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {FORM_FIELDS.usage.label}{" "}
                {FORM_FIELDS.usage.required && (
                  <span className="text-destructive">*</span>
                )}
              </FormLabel>
              <FormControl>
                <Input placeholder={FORM_FIELDS.usage.placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={FORM_FIELDS.deployment.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {FORM_FIELDS.deployment.label}{" "}
                {FORM_FIELDS.deployment.required && (
                  <span className="text-destructive">*</span>
                )}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={FORM_FIELDS.deployment.placeholder}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {FORM_FIELDS.deployment.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={FORM_FIELDS.userCount.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {FORM_FIELDS.userCount.label}{" "}
                {FORM_FIELDS.userCount.required && (
                  <span className="text-destructive">*</span>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={FORM_FIELDS.userCount.placeholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={FORM_FIELDS.enterpriseRequirements.name}
          render={() => (
            <FormItem>
              <FormLabel>
                {FORM_FIELDS.enterpriseRequirements.label}{" "}
                {FORM_FIELDS.enterpriseRequirements.required && (
                  <span className="text-destructive">*</span>
                )}
              </FormLabel>
              <div className="space-y-2 rounded-md border border-input p-3">
                {FORM_FIELDS.enterpriseRequirements.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRequirements.includes(option.value)}
                      onChange={() => toggleRequirement(option.value)}
                      className="h-4 w-4 rounded border-input"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={FORM_FIELDS.additionalNotes.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {FORM_FIELDS.additionalNotes.label}{" "}
                {FORM_FIELDS.additionalNotes.required && (
                  <span className="text-destructive">*</span>
                )}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={FORM_FIELDS.additionalNotes.placeholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
