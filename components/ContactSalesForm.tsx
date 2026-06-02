"use client";

import { useEffect, useState } from "react";
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
import {
  GOOGLE_ADS_CONVERSIONS,
  reportGoogleAdsConversion,
} from "@/lib/google-ads";

function RequiredMarker({ required }: { required: boolean }) {
  if (!required) {
    return null;
  }

  return <span className="text-destructive">*</span>;
}

export function ContactSalesForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ContactFormData>({
    resolver: standardSchemaResolver(contactFormSchema),
    defaultValues: defaultFormValues,
  });

  const currentSetup = form.watch(FORM_FIELDS.currentSetup.name);
  const { getValues, reset, setValue } = form;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const deployment = params.get(FORM_FIELDS.deployment.name);
    const isValidDeployment = FORM_FIELDS.deployment.options.some(
      (option) => option.value === deployment,
    );

    if (deployment && isValidDeployment) {
      reset({
        ...getValues(),
        deployment,
      });
    }
  }, [getValues, reset]);

  useEffect(() => {
    if (currentSetup !== "other-tool") {
      setValue(FORM_FIELDS.currentSetupOther.name, "", {
        shouldValidate: true,
      });
    }
  }, [currentSetup, setValue]);

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
      reportGoogleAdsConversion(GOOGLE_ADS_CONVERSIONS.talkToUsFormSubmit);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center gap-4">
        <CheckCircle2 className="h-12 w-12 text-muted-green" />
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
                <RequiredMarker required={FORM_FIELDS.name.required} />
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
                <RequiredMarker required={FORM_FIELDS.email.required} />
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
                <RequiredMarker required={FORM_FIELDS.company.required} />
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
          name={FORM_FIELDS.building.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {FORM_FIELDS.building.label}{" "}
                <RequiredMarker required={FORM_FIELDS.building.required} />
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={FORM_FIELDS.building.placeholder}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {FORM_FIELDS.building.options.map((option) => (
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
          name={FORM_FIELDS.currentSetup.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {FORM_FIELDS.currentSetup.label}{" "}
                <RequiredMarker required={FORM_FIELDS.currentSetup.required} />
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={FORM_FIELDS.currentSetup.placeholder}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {FORM_FIELDS.currentSetup.options.map((option) => (
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

        {currentSetup === "other-tool" && (
          <FormField
            control={form.control}
            name={FORM_FIELDS.currentSetupOther.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {FORM_FIELDS.currentSetupOther.label}{" "}
                  <RequiredMarker required={currentSetup === "other-tool"} />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={FORM_FIELDS.currentSetupOther.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="space-y-2">
          <div className="text-sm font-medium">
            LLM apps or agents - today vs. in 6-12 months{" "}
            <span className="text-destructive">*</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name={FORM_FIELDS.productionAppCount.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{FORM_FIELDS.productionAppCount.label}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            FORM_FIELDS.productionAppCount.placeholder
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FORM_FIELDS.productionAppCount.options.map((option) => (
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
              name={FORM_FIELDS.plannedAppCount.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{FORM_FIELDS.plannedAppCount.label}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={FORM_FIELDS.plannedAppCount.placeholder}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FORM_FIELDS.plannedAppCount.options.map((option) => (
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
          </div>
        </div>

        <FormField
          control={form.control}
          name={FORM_FIELDS.deployment.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {FORM_FIELDS.deployment.label}{" "}
                <RequiredMarker required={FORM_FIELDS.deployment.required} />
              </FormLabel>
              <Select
                key={field.value}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
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
                <RequiredMarker required={FORM_FIELDS.userCount.required} />
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={FORM_FIELDS.userCount.placeholder}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {FORM_FIELDS.userCount.options.map((option) => (
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
          name={FORM_FIELDS.message.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {FORM_FIELDS.message.label}{" "}
                <RequiredMarker required={FORM_FIELDS.message.required} />
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={FORM_FIELDS.message.placeholder}
                  rows={4}
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

        <Button
          type="submit"
          size="default"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
