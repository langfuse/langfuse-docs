import type { ReactNode, ComponentProps, CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { CornerBox } from './corner-box';
import { Text } from './text';
import IconInfo from '@/components/icons/info';
import IconIdea from '@/components/icons/idea';
import IconSuccess from '@/components/icons/success';
import IconWarning from '@/components/icons/warning';
import IconError from '@/components/icons/error';

export type CalloutType = 'info' | 'warn' | 'error' | 'success' | 'warning' | 'idea';

const iconClass = 'size-4 mt-0.5 text-(--callout-color)';

export function Callout({
  children,
  title,
  ...props
}: { title?: ReactNode } & Omit<CalloutContainerProps, 'title'>) {
  return (
    <CalloutContainer title={title} {...props}>
      {title && <CalloutTitle>{title}</CalloutTitle>}
      <CalloutDescription>{children}</CalloutDescription>
    </CalloutContainer>
  );
}

export interface CalloutContainerProps extends ComponentProps<'div'> {
  title?: ReactNode;
  children?: ReactNode;
  type?: CalloutType;
  icon?: ReactNode;
  emoji?: string;
  className?: string;
  style?: CSSProperties;
}

function resolveAlias(type: CalloutType) {
  if (type === 'warn') return 'warning';
  return type;
}

export function CalloutContainer({
  type: inputType = 'info',
  icon,
  emoji,
  title,
  children,
  className,
  style,
  ...props
}: CalloutContainerProps) {
  const type = resolveAlias(inputType);
  const tone = `var(--callout-${type}, var(--color-fd-muted))`;
  const iconClassName = cn(iconClass, !title && 'mt-0');

  return (
    <CornerBox className="callout">
      <div
        className={cn(
          'bg-stripe-pattern callout-stripe-fade flex border p-4 gap-2 text-sm text-primary',
          !title && 'items-center',
          className,
        )}
        style={
          {
            '--callout-color': tone,
            '--stripe-color': tone,
            ...style,
          } as object
        }
        {...props}
      >
        {icon ?? emoji ??
          {
            info: <IconInfo className={iconClassName} />,
            warning: <IconWarning className={iconClassName} />,
            error: <IconError className={iconClassName} />,
            success: <IconSuccess className={iconClassName} />,
            idea: <IconIdea className={iconClassName} />,
          }[type]}
        <div className="flex flex-col min-w-0 flex-1">{children}</div>
      </div>
    </CornerBox>
  );
}

export function CalloutTitle({ children, className, ...props }: ComponentProps<'p'>) {
  return (
    <Text size="m" className={cn('font-medium my-0! text-text-primary font-medium text-left', className)} {...props}>
      {children}
    </Text>
  );
}

export function CalloutDescription({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('text-text-secondary text-[14px] prose-no-margin empty:hidden', className)}
      {...props}
    >
      {children}
    </div>
  );
}
