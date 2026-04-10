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
    <CalloutContainer {...props}>
      {title && <CalloutTitle>{title}</CalloutTitle>}
      <CalloutDescription>{children}</CalloutDescription>
    </CalloutContainer>
  );
}

export interface CalloutContainerProps extends ComponentProps<'div'> {
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
  children,
  className,
  style,
  ...props
}: CalloutContainerProps) {
  const type = resolveAlias(inputType);
  const tone = `var(--callout-${type}, var(--color-fd-muted))`;

  return (
    <CornerBox>
      <div
        className={cn(
          'bg-stripe-pattern flex border p-4 gap-2 text-sm text-primary',
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
            info: <IconInfo className={iconClass} />,
            warning: <IconWarning className={iconClass} />,
            error: <IconError className={iconClass} />,
            success: <IconSuccess className={iconClass} />,
            idea: <IconIdea className={iconClass} />,
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
